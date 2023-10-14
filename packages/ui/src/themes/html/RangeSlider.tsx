import React from "react";
import { forwardRef } from "react";
import { RangeSliderProps } from "../../theming/ThemeType";
import * as styles from "./RangeSlider.module.css";

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
	({ children, ...props }, ref) => {
		const { min, max, step, list } = props;

		return (
			<>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					list={list}
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
