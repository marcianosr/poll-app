import React, { useRef } from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { ObjectListField, TypedForm } from "../types/field-types";
import { z } from "zod";
import { convertToZod } from "../schemaConverter";
import { FormFields } from "../base-form/FormFields";
import { ObjectListProvider, useCustomField } from "../base-form/FieldContext";
import { FormDataObject } from "../types/form";
import { HiddenFormData } from "../base-form/HiddenFormData";

const ObjectList = ({
  field,
  Errors,
}: FormFieldProps<ObjectListField<string, TypedForm>>) => {
  const { setValue, watch, register } = useCustomField();
  const objectSchema = field.objectSchema;

  const objectList: FormDataObject<typeof objectSchema>[] = watch(
    field.name
  ) as FormDataObject<typeof field.objectSchema>[];

  const newObjectRef = useRef({});

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
            objectRef={newObjectRef}
            setValue={setValue}
            watch={watch}
          >
            <FormFields schema={objectSchema} />
          </ObjectListProvider>
        </fieldset>
        <button
          onClick={(event) => {
            event.preventDefault();
            setValue(field.name, [...objectList, { ...newObjectRef.current }], {
              shouldValidate: true,
            });
            // now to clear the form...
          }}
        >
          Add
        </button>
      </div>
      <Errors />
    </>
  );
};

export const objectListPlugin: FormFieldPlugin<
  ObjectListField<string, TypedForm>,
  z.ZodArray<z.ZodTypeAny>
> = {
  fieldType: "objectList",
  Component: ObjectList,
  toZodSchema: (field) => convertToZod(field.objectSchema).array(),
};
