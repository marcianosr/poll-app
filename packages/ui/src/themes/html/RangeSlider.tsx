import React from "react";
import { forwardRef } from "react";
import { RangeSliderProps } from "../../theming/ThemeType";
import * as styles from "./RangeSlider.module.css";

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
    ({ children, labels, ...props }, ref) => {
        const listName = `${props.name}-list`;
        return (
            <>
                <input ref={ref} type="range" list={listName} {...props} />
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
