import {
    ClassAttributes,
    ForwardRefExoticComponent,
    PropsWithChildren,
} from "react";

export type ButtonProps = PropsWithChildren<
    {
        /**
         * This prop is just as test, the real interface props are not defined yet.
         */
        size?: "small" | "medium" | "large";
    } & JSX.IntrinsicElements["button"]
>;

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

export type FormFieldProps = {
    fieldTitle: React.ReactNode;
    fieldInput: React.ReactNode;
    fieldErrors?: React.ReactNode;
};

export type Theme = {
    button: ForwardRefExoticComponent<
        ButtonProps & ClassAttributes<HTMLButtonElement>
    >;
    rangeSlider: ForwardRefExoticComponent<
        RangeSliderProps & ClassAttributes<HTMLInputElement>
    >;
    formField: React.FC<FormFieldProps>;
};
