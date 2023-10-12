import React from "react";
import { forwardRef } from "react";
import { ButtonProps } from "../../theming/ThemeType";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => (
        <button {...props} ref={ref}>
            {children}
        </button>
    )
);
