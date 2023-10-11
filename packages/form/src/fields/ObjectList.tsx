import React, { useState } from "react";
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
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

  const resetValues = schemaToDefaultValues(objectSchema);
  // Maybe add option to object list to display as table or as cards?
  return (
    <>
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
                    <td key={field.name}>{JSON.stringify(item[field.name])}</td>
                  ))}
                  <td>
                    <button
                      onClick={() => {
                        setEditIndex(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setEditIndex(undefined);
                        setValue(objectList.filter((e) => e !== item));
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
                {index === editIndex && (
                  <tr>
                    <td colSpan={objectSchema.length + 1}>
                      <fieldset>
                        <legend>Edit item</legend>
                        <ObjectScopeProvider<
                          FormDataObject<typeof objectSchema>
                        >
                          path={[`${field.name}__edit`]}
                          defaultValues={item}
                        >
                          {({ getValues }) => (
                            <>
                              <FormFields schema={objectSchema} />
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  setEditIndex(undefined);
                                  setValue(
                                    objectList.map((item, index) =>
                                      index === editIndex
                                        ? { ...getValues() }
                                        : item
                                    )
                                  );
                                }}
                              >
                                Update item
                              </button>{" "}
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  setEditIndex(undefined);
                                }}
                              >
                                Cancel
                              </button>
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
        <fieldset>
          <legend>Add new</legend>
          <ObjectScopeProvider<FormDataObject<typeof objectSchema>>
            path={[`${field.name}__new`]}
            defaultValues={resetValues}
          >
            {({ getValues, reset }) => (
              <>
                <FormFields schema={objectSchema} />
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    setEditIndex(undefined);
                    setValue([...objectList, { ...getValues() }]);
                    reset(resetValues);
                  }}
                >
                  Add Item
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
      .apply(field.minimalAmount, (z, min) =>
        z.min(min, {
          message: `List must contain at least ${min} ${field.displayName}`,
        })
      )
      .result(),
};
