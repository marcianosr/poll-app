import React from "react";
import { useCustomField } from "./FieldContext";
import { FieldType } from "@marcianosrs/form-schema";

const createFieldName = (path: string[]) =>
    `${path[0]}[${[...path.slice(1)].join("][")}]`;

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
            (result, [name, value]) => ({
                ...result,
                ...objectToFormMapping([...prefix, name], value),
            }),
            {}
        );
    }

    if (
        prefix.some((part) => part.endsWith("__edit")) ||
        prefix.some((part) => part.endsWith("__new"))
    ) {
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
    const { watch } = useCustomField(field);
    const object = watch();
    const fields = objectToFormMapping([field.name], object);
    return (
        <>
            {Object.entries(fields).map(([name, value]) => (
                <input type="hidden" name={name} value={value} key={name} />
            ))}
        </>
    );
};
