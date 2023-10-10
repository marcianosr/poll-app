import React, {
  ChangeEvent,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import type {
  FieldPath,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TypedForm } from "../types/field-types";
import { FormDataObject } from "../types/form";
import { isInputElement } from "@marcianosrs/utils";

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

export const ObjectListProvider = <
  TFieldValues extends FieldValues,
  FormSchema extends TypedForm
>({
  children,
  schema,
  ...props
}: Omit<FieldContextType<TFieldValues>, "register"> & {
  schema: FormSchema;
  children: ({
    reset,
    getValues,
  }: {
    reset: (values: Partial<FormDataObject<FormSchema>>) => void;
    getValues: () => Partial<FormDataObject<FormSchema>>;
  }) => React.ReactNode;
}) => {
  const objectRef = useRef<Record<string, unknown>>({});
  const fieldRefs = useRef<
    Record<
      string,
      {
        ref?: HTMLElement;
      }
    >
  >({});

  const contextValue = useMemo(() => {
    return {
      register: (fieldName: string) => ({
        onChange: (
          event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        ) => {
          objectRef.current[fieldName] = event.target.value;
        },
        ref: (item: HTMLElement) => {
          fieldRefs.current[fieldName] = { ref: item };
        },
      }),
    };
  }, [schema]);

  return (
    <FieldContext.Provider
      value={contextValue as FieldContextType<FieldValues>}
    >
      {children({
        reset: (newValues) => {
          for (const [name, data] of Object.entries(fieldRefs.current)) {
            // This should be repeated for checkboxes, radio, selects and text areas
            if (isInputElement(data.ref)) {
              data.ref.value = `${
                newValues[name as keyof FormDataObject<FormSchema>] ?? ""
              }`;
            }
          }
        },
        getValues: () =>
          ({ ...objectRef.current } as FormDataObject<FormSchema>),
      })}
    </FieldContext.Provider>
  );
};

export const useCustomField = () => useContext(FieldContext);
