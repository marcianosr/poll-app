import React from "react";
import { useCustomField, useObjectScope } from "./FieldContext";
import { FieldType } from "@marcianosrs/form-schema";
import { createFieldName } from "./createFieldName";

const objectToFormMapping = (
    prefix: string[],
    object: unknown
): Record<string, string> => {
    if (Array.isArray(object)) {
        return object.reduce(
            (result, item, index) => ({
                ...result,
                ...objectToFormMapping([...prefix, `${index}`], item),
            }),
            {}
        );
    }
    if (typeof object === "object" && object !== null) {
        return Object.entries(object).reduce(
            (result, [name, value]) =>
                value === undefined
                    ? result
                    : {
                          ...result,
                          ...objectToFormMapping([...prefix, name], value),
                      },
            { ...objectToFormMapping([...prefix, "__objKeep"], "true") }
        );
    }
    if (object === undefined) {
        return {};
    }

    return { [createFieldName(prefix)]: `${object}` };
};

type HiddenFormDataProps<TField extends FieldType<string>> = {
    field: TField;
};

export const HiddenFormData = <TField extends FieldType<string>>({
    field,
}: HiddenFormDataProps<TField>) => {
    if (field.valueType === "none") {
        return null;
    }
    const { watch } = useCustomField(field);
    const existingPath = useObjectScope();
    const object = watch();
    const fields = objectToFormMapping(existingPath.concat(field.name), object);
    return (
        <>
            {Object.entries(fields)
                .filter(([name]) => name.includes("["))
                .map(([name, value]) => (
                    <input type="hidden" name={name} value={value} key={name} />
                ))}
        </>
    );
};
