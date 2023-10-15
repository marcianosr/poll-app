import { FieldType, ValueTypeOfField } from "@marcianosrs/form-schema";
import React, {
    type PropsWithChildren,
    createContext,
    useContext,
    useEffect,
} from "react";
import type {
    FieldPath,
    UseFormRegister,
    UseFormRegisterReturn,
    UseFormSetValue,
    UseFormWatch,
    UseFormReturn,
} from "react-hook-form";
import { createFieldName } from "./createFieldName";

/**
 * This file uses some nasty type casting to interface with React hook form
 * These components are ugly here so that the rest of the codebase does not feel the pain of interfacing with the lib.
 */

type FieldValues = Record<string, unknown>;
type FormState<TFieldValues extends FieldValues> =
    UseFormReturn<TFieldValues>["formState"];

type FieldContextType<TFieldValues extends FieldValues> = {
    register: UseFormRegister<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    watch: UseFormWatch<TFieldValues>;
    state: FormState<TFieldValues>;
};

/**
 * Ugly function to create an empty stub, but could be used in tests as well
 */
const createRegister = <TFieldValues extends FieldValues>() =>
    (() =>
        ({
            onChange: async () => {},
            onBlur: async () => {},
            ref: () => {},
            name: "--",
        } as unknown as UseFormRegisterReturn<
            FieldPath<TFieldValues>
        >)) as UseFormRegister<TFieldValues>;

const createWatch = <TFieldValues extends FieldValues>() =>
    (() => {}) as UseFormWatch<TFieldValues>;

const FieldContext = createContext<FieldContextType<FieldValues>>({
    register: createRegister(),
    setValue: () => {},
    watch: createWatch(),
    state: {
        isDirty: false,
        isLoading: false,
        isSubmitSuccessful: false,
        isSubmitted: false,
        isSubmitting: false,
        isValid: false,
        isValidating: false,
        submitCount: 0,
        dirtyFields: Object.freeze({}),
        touchedFields: Object.freeze({}),
        errors: {},
    },
});

export const FieldProvider = <TFieldValues extends FieldValues>({
    children,
    ...props
}: PropsWithChildren<FieldContextType<TFieldValues>>) => (
    <FieldContext.Provider value={props as FieldContextType<FieldValues>}>
        {children}
    </FieldContext.Provider>
);

const FormObjectScopeContext = createContext<{ path: string[] }>({
    path: [],
});

export const useObjectScope = () => useContext(FormObjectScopeContext).path;

export const ObjectScopeProvider = <TValueType,>({
    children,
    path,
    defaultValues,
}: {
    children: ({
        reset,
        getValues,
    }: {
        reset: (values: Partial<TValueType>) => void;
        getValues: () => TValueType;
    }) => React.ReactNode;
    path: string[];
    defaultValues: Partial<TValueType>;
}) => {
    const existingPath = useObjectScope();
    const { watch, setValue } = useContext(FieldContext);
    const objectPath = existingPath.concat(path);
    const fieldName = createFieldName(objectPath);

    useEffect(() => {
        setValue(fieldName, defaultValues);
    }, []);

    return (
        <FormObjectScopeContext.Provider value={{ path: objectPath }}>
            {children({
                reset: (newValues) => {
                    setValue(fieldName, newValues);
                },
                getValues: () => watch(objectPath.join(".")) as TValueType,
            })}
        </FormObjectScopeContext.Provider>
    );
};

type CustomFieldResult<TField extends FieldType<string>> = {
    register: () => UseFormRegisterReturn<string>;
    watch: () => ValueTypeOfField<TField>;
    setValue: (value: ValueTypeOfField<TField>) => void;
    errors: string[];
    hasErrors: (itemPath: string[]) => boolean;
};

type FormErrors<TFieldValues extends FieldValues> = {
    [Key in keyof TFieldValues]: {
        message?: string;
        type?: string;
    } & FormErrors<Omit<TFieldValues[Key], "message" | "type">>;
};

const getErrors = (fieldPath: string[], errors: FormErrors<FieldValues>) =>
    fieldPath.reduce<FormErrors<FieldValues> | null>((errors, pathElem) => {
        if (errors === null) {
            return null;
        }
        const error = errors[pathElem];
        return error ? error : null;
    }, errors);

export const useCustomField = <TField extends FieldType<string>>(
    field: TField
): CustomFieldResult<TField> => {
    const { watch, register, setValue, state } = useContext(FieldContext);
    const path = useObjectScope();

    const fieldPath = path.concat(field.name);
    const fieldPathKey = fieldPath.join(".");

    return {
        register: () => register(fieldPathKey),
        watch: () => {
            const value = watch(fieldPathKey) as ValueTypeOfField<TField>;
            if (
                (value === "" || value === undefined) &&
                field.valueType === "objects"
            ) {
                return [] as unknown as ValueTypeOfField<TField>;
            }
            return value;
        },
        setValue: (value) => {
            setValue(fieldPathKey, value, { shouldValidate: true });
        },
        get errors() {
            const errorObject = getErrors(
                fieldPath,
                state.errors as FormErrors<FieldValues>
            );
            return (
                errorObject && errorObject.message ? [errorObject.message] : []
            ) as string[];
        },
        hasErrors: (path) => {
            const errorObject = getErrors(
                fieldPath.concat(path),
                state.errors as FormErrors<FieldValues>
            );
            return errorObject !== null;
        },
    };
};
