import { ComponentType, ReactNode } from "react";
import { FieldType } from "./field-types";
import { ValueTypeOfField } from "./form";

export type FormFieldProps<T extends FieldType<string>> = {
  field: T;
  value?: ValueTypeOfField<T>;
  onChange?: (newValue: ValueTypeOfField<T>) => void;
};

export type FormFieldPlugin<T extends FieldType<string>> = {
  fieldType: T["fieldType"];
  Component: ComponentType<FormFieldProps<T>>;
};
