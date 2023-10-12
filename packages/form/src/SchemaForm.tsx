import React from "react";
import { RemixForm } from "./RemixForm";
import { type ZodSchemaType, schemaToZod } from "./schema/schemaToZod";
import { FormField } from "./base-form/FormField";
import { FieldProvider } from "./base-form/FieldContext";
import { z } from "zod";
import { schemaToDefaultValues } from "./schema/schemaToDefaultValues";
import type { TypedForm } from "@marcianosrs/form-schema";

type SchemaFormProps<Schema extends TypedForm> = {
    schema: Schema;
};

interface FormValues {
    [x: string]: unknown | unknown[];
}

type RemixFormValues<Schema extends TypedForm> = Partial<
    Record<keyof z.infer<ZodSchemaType<Schema>>, unknown>
>;

export const SchemaForm = <Schema extends TypedForm>({
    schema,
}: SchemaFormProps<Schema>) => {
    const zodSchema = schemaToZod(schema);
    const values: FormValues = schemaToDefaultValues(schema);

    return (
        <RemixForm
            schema={zodSchema}
            values={values as RemixFormValues<Schema>}
        >
            {({
                Field,
                Errors,
                Button,
                watch,
                setValue,
                register,
                formState,
            }) => (
                <FieldProvider
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    state={formState}
                >
                    {schema.map((field) => (
                        <Field key={field.name} name={field.name}>
                            {() => <FormField key={field.name} field={field} />}
                        </Field>
                    ))}
                    <Errors />
                    <Button />
                </FieldProvider>
            )}
        </RemixForm>
    );
};
