import React from "react";
import { forwardRef } from "react";
import { ButtonProps } from "../../theming/ThemeType";
import styles from "./Button.module.css";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => (
        <button {...props} ref={ref} className={styles.button}>
            {children}
        </button>
    )
);
