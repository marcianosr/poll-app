import { ComponentType, ReactNode } from "react";
import { FieldType } from "./field-types";
import { ValueTypeOfField } from "./form";
import { z } from "zod";

export type FormFieldProps<T extends FieldType<string>> = {
  field: T;
  value?: ValueTypeOfField<T>;
  keyPrefix?: string[];
};

export type FormFieldPlugin<
  T extends FieldType<string>,
  Z extends z.ZodTypeAny = z.ZodTypeAny
> = {
  fieldType: T["fieldType"];
  Component: ComponentType<FormFieldProps<T>>;
  toZodSchema: (field: T) => Z;
};
