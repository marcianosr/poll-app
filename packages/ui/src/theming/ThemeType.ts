import { ClassAttributes, ForwardRefExoticComponent } from "react";
import { FormFieldProps } from "../components/FormField";
import { ButtonProps } from "../components/Button";
import { RangeSliderProps } from "../components/RangeSlider";
import { TableProps } from "../components/Table";

export type Theme = {
    button: ForwardRefExoticComponent<
        ButtonProps & ClassAttributes<HTMLButtonElement>
    >;
    rangeSlider: ForwardRefExoticComponent<
        RangeSliderProps & ClassAttributes<HTMLInputElement>
    >;
    formField: React.FC<FormFieldProps>;
    table: <T>(props: TableProps<T>) => React.ReactNode;
};
