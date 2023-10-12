import { ComponentType } from "react";
import { FieldType, ValueTypeOfField } from "@marcianosrs/form-schema";
import { z } from "zod";

export type FormFieldProps<T extends FieldType<string>> = {
    field: T;
};

export type DisplayValueProps<T extends FieldType<string>> = {
    field: T;
    value?: ValueTypeOfField<T>;
};

export type FormFieldPlugin<
    T extends FieldType<string>,
    Z extends z.ZodTypeAny = z.ZodTypeAny
> = {
    fieldType: T["fieldType"];
    Component: ComponentType<FormFieldProps<T>>;
    Show: ComponentType<DisplayValueProps<T>>;
    toZodSchema: (field: T) => Z;
};
