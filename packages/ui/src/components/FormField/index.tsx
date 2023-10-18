import React from "react";
import { useThemedElement } from "../../theming/useThemedElement";

export type FormFieldProps = {
    fieldTitle: React.ReactNode;
    fieldInput: React.ReactNode;
    fieldErrors?: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({ ...props }) => {
    const ThemedFormField = useThemedElement("formField");
    return <ThemedFormField {...props} />;
};
