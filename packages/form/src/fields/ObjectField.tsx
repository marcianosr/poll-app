import React from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { schemaToZod } from "../schema/schemaToZod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import { FormFields } from "../base-form/FormFields";
import type {
    FormDataObject,
    ObjectField,
    TypedForm,
} from "@marcianosrs/form-schema";

const ObjectField = <TForm extends TypedForm>({
    field,
}: FormFieldProps<ObjectField<string, TForm>>) => {
    const { watch, errors } = useCustomField(field);
    const objectSchema = field.objectSchema;
    type RecordType = FormDataObject<typeof field.objectSchema>;
    const object = watch();

    return (
        <div>
            <fieldset>
                <legend>{field.displayName}</legend>
                <ObjectScopeProvider<RecordType>
                    path={[`${field.name}`]}
                    defaultValues={object}
                >
                    {() => <FormFields schema={objectSchema} />}
                </ObjectScopeProvider>
            </fieldset>
            {errors?.map((e, i) => (
                <p key={i}>{e}</p>
            ))}
        </div>
    );
};

export const objectFieldPlugin: FormFieldPlugin<
    ObjectField<string, TypedForm>,
    z.ZodTypeAny
> = {
    fieldType: "object",
    Component: ObjectField,
    Show: ({ field }) => `${field.displayName}`,
    toZodSchema: (field) => schemaToZod(field.objectSchema),
};
