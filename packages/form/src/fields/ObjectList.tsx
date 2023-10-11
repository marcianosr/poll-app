import React from "react";
import { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { ObjectListField, TypedForm } from "../types/field-types";
import { z } from "zod";
import { schemaToZod } from "../schema/schemaToZod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import { transform } from "@marcianosrs/utils";
import { HiddenFormData } from "../base-form/HiddenFormData";
import { FormFields } from "../base-form/FormFields";
import { FormDataObject } from "../types/form";
import { schemaToDefaultValues } from "../schema/schemaToDefaultValues";

const ObjectList = ({
  field,
  errors,
}: FormFieldProps<ObjectListField<string, TypedForm>>) => {
  const { watch, setValue } = useCustomField(field);
  const objectSchema = field.objectSchema;
  const objectList: Record<string, unknown>[] = watch();

  const resetValues = schemaToDefaultValues(objectSchema);
  // Maybe add option to object list to display as table or as cards?
  return (
    <>
      <label>{field.displayName}</label>
      <div style={{ border: "1px solid red", padding: "0.5rem" }}>
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
              <tr key={index}>
                {objectSchema.map((field) => (
                  <td key={field.name}>{JSON.stringify(item[field.name])}</td>
                ))}
                <td>
                  <button
                    onClick={() => {
                      setValue(objectList.filter((e) => e !== item));
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <HiddenFormData field={field} />
        <fieldset>
          <ObjectScopeProvider<FormDataObject<typeof objectSchema>>
            path={[`${field.name}_new`]}
            defaultValues={resetValues}
          >
            {({ getValues, reset }) => (
              <>
                <FormFields schema={objectSchema} />
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    setValue([...objectList, { ...getValues() }]);
                    reset(resetValues);
                  }}
                >
                  Add
                </button>
              </>
            )}
          </ObjectScopeProvider>
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
