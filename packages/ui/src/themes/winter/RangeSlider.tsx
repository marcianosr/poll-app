import React from "react";
import { forwardRef } from "react";
import { RangeSliderProps } from "../../theming/ThemeType";
import * as styles from "./RangeSlider.module.css";
import { useThemeSettings } from "./themeSettings";

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
	({ children, max, min, step, labels, ...props }, ref) => {
		const settings = useThemeSettings();
		const listName = `${props.name}-list`;

		const styleClasses = [styles.input, settings.snow && styles.snow]
			.filter((e) => e !== undefined)
			.join(" ");

		return (
			<>
				<input
					ref={ref}
					type="range"
					min={min}
					max={max}
					step={step}
					className={styleClasses}
					list={listName}
					{...props}
				/>
				<datalist id={listName} className={styles.default.dataList}>
					{labels.map((label) => (
						<option key={label.value} value={label.value}>
							{label.title}
						</option>
					))}
				</datalist>
			</>
		);
	}
);
