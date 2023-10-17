import React, { forwardRef } from "react";
import { FormFieldProps } from "../../theming/ThemeType";
import { useThemedElement } from "../../theming/useThemedElement";

export const FormField: React.FC<FormFieldProps> = ({ ...props }) => {
    const ThemedFormField = useThemedElement("formField");
    return <ThemedFormField {...props} />;
};
