import React from "react";
import styles from "./FormField.module.css";
import { FormFieldProps } from "../../components/FormField";

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
