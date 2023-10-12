import { TypedForm } from "@marcianosrs/form-schema";

export const themeSettings = [
    {
        displayName: "Snow",
        name: "snow",
        valueType: "boolean",
        fieldType: "checkbox",
        defaultValue: false,
        optional: false,
    },
] as const satisfies TypedForm;
