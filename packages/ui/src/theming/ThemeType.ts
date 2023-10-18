import {
    ClassAttributes,
    ForwardRefExoticComponent,
    PropsWithChildren,
} from "react";
import { FormFieldProps } from "../components/FormField";
import { ButtonProps } from "../components/Button";
import { RangeSliderProps } from "../components/RangeSlider";

export type Theme = {
    button: ForwardRefExoticComponent<
        ButtonProps & ClassAttributes<HTMLButtonElement>
    >;
    rangeSlider: ForwardRefExoticComponent<
        RangeSliderProps & ClassAttributes<HTMLInputElement>
    >;
    formField: React.FC<FormFieldProps>;
};
