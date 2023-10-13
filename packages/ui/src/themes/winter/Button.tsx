import React from "react";
import { forwardRef } from "react";
import { ButtonProps } from "../../theming/ThemeType";
import * as styles from "./Button.module.css";
import { useThemeSettings } from "./themeSettings";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => {
        const settings = useThemeSettings();

        const styleClasses = [styles.button, settings.snow && styles.snow]
            .filter((e) => e !== undefined)
            .join(" ");

        return (
            <button {...props} ref={ref} className={styleClasses}>
                {children}
            </button>
        );
    }
);
