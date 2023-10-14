import React, { forwardRef } from "react";
import { RangeSliderProps } from "../../theming/ThemeType";
import { useThemedElement } from "../../theming/useThemedElement";

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
	({ children, ...props }, ref) => {
		const ThemedRangeSlider = useThemedElement("rangeSlider");

		return (
			<ThemedRangeSlider ref={ref} {...props}>
				{children}
			</ThemedRangeSlider>
		);
	}
);
