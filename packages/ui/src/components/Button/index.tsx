import React, { forwardRef } from "react";
import { ButtonProps } from "../../theming/ThemeType";
import { useThemedElement } from "../../theming/useThemedElement";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, ...props }, ref) => {
        const ThemedButton = useThemedElement("button");
        return (
            <ThemedButton ref={ref} {...props}>
                {children}
            </ThemedButton>
        );
    }
);
