import React from "react";
import { FormFieldProps } from "../../components/FormField";

export const FormField: React.FC<FormFieldProps> = ({
    fieldTitle,
    fieldInput,
    fieldErrors,
}) => {
    return (
        <div>
            <p>{fieldTitle}</p>
            <div>{fieldInput}</div>
            {fieldErrors}
        </div>
    );
};
