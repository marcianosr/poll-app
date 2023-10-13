import React, { useState } from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { schemaToZod } from "../schema/schemaToZod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import { transform } from "@marcianosrs/utils";
import { HiddenFormData } from "../base-form/HiddenFormData";
import { FormFields } from "../base-form/FormFields";
import { FormFieldValue } from "../base-form/FormFieldValue";
import { Button } from "@marcianosrs/ui";
import {
    schemaToDefaultValues,
    type FormDataObject,
    type ObjectListField,
    type TypedForm,
} from "@marcianosrs/form-schema";

const ObjectList = <TForm extends TypedForm>({
    field,
}: FormFieldProps<ObjectListField<string, TForm>>) => {
    const { watch, setValue, errors, hasErrors } = useCustomField(field);
    const objectSchema = field.objectSchema;
    type RecordType = FormDataObject<typeof field.objectSchema>;
    const objectList = watch();
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    const resetValues = schemaToDefaultValues(objectSchema);
    // Maybe add option to object list to display as table or as cards?
    return (
        <div>
            <label>{field.displayName}</label>
            <div>
                <table>
                    <thead>
                        <tr>
                            {objectSchema.map((field) => (
                                <th key={field.name}>{field.displayName}</th>
                            ))}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {objectList.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    {objectSchema.map((field) => (
                                        <td key={field.name}>
                                            <FormFieldValue
                                                field={field}
                                                value={
                                                    item[
                                                        field.name as keyof RecordType
                                                    ]
                                                }
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <Button
                                            onClick={() => {
                                                setEditIndex(index);
                                            }}
                                            disabled={editIndex === index}
                                        >
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            onClick={() => {
                                                setEditIndex(undefined);
                                                setValue(
                                                    objectList.filter(
                                                        (e) => e !== item
                                                    )
                                                );
                                            }}
                                        >
                                            Remove
                                        </Button>
                                        {hasErrors([`${index}`]) && (
                                            <span title="Item has errors">
                                                ⚠️
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                {index === editIndex && (
                                    <tr>
                                        <td colSpan={objectSchema.length + 1}>
                                            <fieldset>
                                                <legend>Edit item</legend>
                                                <ObjectScopeProvider<RecordType>
                                                    path={[
                                                        `${field.name}`,
                                                        `${index}`,
                                                    ]}
                                                    defaultValues={item}
                                                >
                                                    {({ getValues }) => (
                                                        <>
                                                            <FormFields
                                                                schema={
                                                                    objectSchema
                                                                }
                                                            />
                                                            <Button
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.preventDefault();
                                                                    setEditIndex(
                                                                        undefined
                                                                    );
                                                                    setValue(
                                                                        objectList.map<RecordType>(
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) =>
                                                                                index ===
                                                                                editIndex
                                                                                    ? {
                                                                                          ...getValues(),
                                                                                      }
                                                                                    : item
                                                                        )
                                                                    );
                                                                }}
                                                            >
                                                                Update item
                                                            </Button>{" "}
                                                            <Button
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.preventDefault();
                                                                    setEditIndex(
                                                                        undefined
                                                                    );
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    )}
                                                </ObjectScopeProvider>
                                            </fieldset>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                <HiddenFormData field={field} />
                <Button
                    onClick={(event) => {
                        event.preventDefault();
                        setValue([...objectList, { ...resetValues }]);
                        setEditIndex(objectList.length);
                    }}
                >
                    Add Item
                </Button>
            </div>
            {errors?.map((e, i) => (
                <p key={i}>{e}</p>
            ))}
        </div>
    );
};

export const objectListPlugin: FormFieldPlugin<
    ObjectListField<string, TypedForm>,
    z.ZodArray<z.ZodTypeAny>
> = {
    fieldType: "objectList",
    Component: ObjectList,
    Show: ({ value = [] }) => `${value.length} items`,
    toZodSchema: (field) =>
        transform(schemaToZod(field.objectSchema).array())
            .apply(field.minimalAmount, (z, min) =>
                z.min(min, {
                    message: `List must contain at least ${min} ${field.displayName}`,
                })
            )
            .result(),
};
