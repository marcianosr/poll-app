import React from "react";
import { forwardRef } from "react";
import styles from "./Button.module.css";
import { useThemeSettings } from "./themeSettings";
import { ButtonProps } from "../../components/Button";

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
