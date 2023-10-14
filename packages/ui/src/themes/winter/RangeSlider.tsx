import React from "react";
import { forwardRef } from "react";
import { RangeSliderProps } from "../../theming/ThemeType";
import * as styles from "./RangeSlider.module.css";
import { useThemeSettings } from "./themeSettings";

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
	({ children, ...props }, ref) => {
		const settings = useThemeSettings();

		const { min, max, step, list } = props;

		const styleClasses = [styles.input, settings.snow && styles.snow]
			.filter((e) => e !== undefined)
			.join(" ");

		return (
			<>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					list={list}
					className={styleClasses}
				/>
				<datalist id="values" className={styles.default.dataList}>
					{props.labels?.map((label) => (
						<option key={label.value} value={label.value}>
							{label.title}
						</option>
					))}
				</datalist>
			</>
		);
	}
);
