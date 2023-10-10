import { ComponentType, ReactNode } from "react";
import { FieldType } from "./field-types";
import { ValueTypeOfField } from "./form";
import { z } from "zod";

type ComponentOrTagName<ElementType extends keyof JSX.IntrinsicElements> =
  | React.ComponentType<JSX.IntrinsicElements[ElementType]>
  | string;

export type FormFieldProps<T extends FieldType<string>> = {
  field: T;
  Errors: ComponentOrTagName<"div">;
  value?: ValueTypeOfField<T>;
};

export type FormFieldPlugin<
  T extends FieldType<string>,
  Z extends z.ZodTypeAny = z.ZodTypeAny
> = {
  fieldType: T["fieldType"];
  Component: ComponentType<FormFieldProps<T>>;
  toZodSchema: (field: T) => Z;
};
