import React, { PropsWithChildren, forwardRef } from "react";
import { useThemedElement } from "../../theming/useThemedElement";

export type RangeSliderProps = PropsWithChildren<
    {
        labels: {
            title: string;
            value: number;
        }[];
        min: number;
        max: number;
        step: number;
    } & JSX.IntrinsicElements["input"]
>;

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
