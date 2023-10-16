import React from "react";
import { FormFieldProps } from "../../theming/ThemeType";
import styles from "./FormField.module.css";

export const FormField: React.FC<FormFieldProps> = ({
    fieldTitle,
    fieldInput,
    fieldErrors,
}) => {
    return (
        <div className={styles.formField}>
            <p>{fieldTitle}</p>
            <div>{fieldInput}</div>
            {fieldErrors}
        </div>
    );
};
