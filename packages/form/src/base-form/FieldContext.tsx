import React, {
  PropsWithChildren,
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
} from "react-hook-form";
import { FieldType, TypedForm } from "../types/field-types";
import { ValueTypeOfField } from "../types/form";

/**
 * This file uses some nasty type casting to interface with React hook form
 * These components are ugly here so that the rest of the codebase does not feel the pain of interfacing with the lib.
 */

type FieldValues = Record<string, unknown>;

type FieldContextType<TFieldValues extends FieldValues> = {
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
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
  (() => {
    unsubscribe: () => {};
  }) as UseFormWatch<TFieldValues>;

const FieldContext = createContext<FieldContextType<FieldValues>>({
  register: createRegister(),
  setValue: () => {},
  watch: createWatch(),
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

const useObjectScope = () => useContext(FormObjectScopeContext).path;

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
    getValues: () => Partial<TValueType>;
  }) => React.ReactNode;
  path: string[];
  defaultValues: Partial<TValueType>;
}) => {
  const existingPath = useObjectScope();
  const { watch, setValue } = useContext(FieldContext);
  const objectPath = existingPath.concat(path);

  useEffect(() => {
    setValue(objectPath.join("."), defaultValues);
  }, []);

  return (
    <FormObjectScopeContext.Provider value={{ path: objectPath }}>
      {children({
        reset: (newValues) => {
          setValue(objectPath.join("."), newValues);
        },
        getValues: () =>
          watch(objectPath.join(".")) as unknown as Partial<TValueType>,
      })}
    </FormObjectScopeContext.Provider>
  );
};

type CustomFieldResult<TField extends FieldType<string>> = {
  register: () => UseFormRegisterReturn<string>;
  watch: () => ValueTypeOfField<TField>;
  setValue: (value: ValueTypeOfField<TField>) => void;
};

export const useCustomField = <TField extends FieldType<string>>(
  field: TField
): CustomFieldResult<TField> => {
  const { watch, register, setValue } = useContext(FieldContext);
  const path = useObjectScope();

  const fieldPath = path.concat(field.name).join(".");
  return {
    register: () => register(fieldPath),
    watch: () => {
      const value = watch(fieldPath) as ValueTypeOfField<TField>;
      if (
        (value === "" || value === undefined) &&
        field.fieldType === "objectList"
      ) {
        return [] as unknown as ValueTypeOfField<TField>;
      }
      return value;
    },
    setValue: (value) => {
      setValue(fieldPath, value, { shouldValidate: true });
    },
  };
};
