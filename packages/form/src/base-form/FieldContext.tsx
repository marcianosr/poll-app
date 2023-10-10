import React, {
  ChangeEvent,
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import type {
  FieldPath,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TypedForm } from "../types/field-types";

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
  objectRef,
  ...props
}: PropsWithChildren<
  Omit<FieldContextType<TFieldValues>, "register"> & {
    schema: FormSchema;
    objectRef: MutableRefObject<Record<string, unknown>>;
  }
>) => {
  const contextValue = useMemo(() => {
    return {
      register: (fieldName: string) => ({
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          objectRef.current[fieldName] = event.target.value;
        },
      }),
    };
  }, [schema]);

  return (
    <FieldContext.Provider
      value={contextValue as FieldContextType<FieldValues>}
    >
      {children}
    </FieldContext.Provider>
  );
};

export const useCustomField = () => useContext(FieldContext);
