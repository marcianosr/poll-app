import React from "react";
import { forwardRef } from "react";
import * as styles from "./RangeSlider.module.css";
import { useThemeSettings } from "./themeSettings";
import { RangeSliderProps } from "../../components/RangeSlider";

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
    ({ children, labels, ...props }, ref) => {
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
