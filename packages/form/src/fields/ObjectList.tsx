import React, { useRef } from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { ObjectListField, TypedForm } from "../types/field-types";
import { z } from "zod";
import { schemaToZod } from "../schema/schemaToZod";
import { FormFields } from "../base-form/FormFields";
import { ObjectListProvider, useCustomField } from "../base-form/FieldContext";
import { FormDataObject } from "../types/form";
import { HiddenFormData } from "../base-form/HiddenFormData";
import { transform } from "@marcianosrs/utils";

const ObjectList = ({
  field,
  errors,
}: FormFieldProps<ObjectListField<string, TypedForm>>) => {
  const { setValue, watch, register } = useCustomField();
  const objectSchema = field.objectSchema;

  const objectList: FormDataObject<typeof objectSchema>[] = watch(
    field.name
  ) as FormDataObject<typeof field.objectSchema>[];

  const fieldName = field.name;

  return (
    <>
      <label>{field.displayName}</label>
      <div style={{ border: "1px solid red", padding: "0.5rem" }}>
        <ul>
          {objectList.map((item, index) => {
            return (
              <li key={index}>
                {JSON.stringify(item)}{" "}
                <button
                  onClick={() => {
                    setValue(
                      field.name,
                      objectList.filter((e) => e !== item),
                      { shouldValidate: true }
                    );
                  }}
                >
                  Remove
                </button>
              </li>
            );
          })}
          <HiddenFormData object={objectList} prefix={[fieldName]} />
        </ul>
        <fieldset>
          <ObjectListProvider
            schema={field.objectSchema}
            setValue={setValue}
            watch={watch}
          >
            {({ reset, getValues }) => (
              <>
                <FormFields schema={objectSchema} />
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    setValue(field.name, [...objectList, { ...getValues() }], {
                      shouldValidate: true,
                    });
                    reset({});
                  }}
                >
                  Add
                </button>
              </>
            )}
          </ObjectListProvider>
        </fieldset>
      </div>
      {errors?.map((e, i) => (
        <p key={i}>{e}</p>
      ))}
    </>
  );
};

export const objectListPlugin: FormFieldPlugin<
  ObjectListField<string, TypedForm>,
  z.ZodArray<z.ZodTypeAny>
> = {
  fieldType: "objectList",
  Component: ObjectList,
  toZodSchema: (field) =>
    transform(schemaToZod(field.objectSchema).array())
      .apply(field.minimalAmount, (z, min) => z.min(min))
      .result(),
};
