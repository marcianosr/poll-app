import {
    ForwardRefExoticComponent,
    HTMLAttributes,
    PropsWithChildren,
    RefAttributes,
} from "react";

export type ButtonProps = PropsWithChildren<
    {
        /**
         * This prop is just as test, the real interface props are not defined yet.
         */
        size?: "small" | "medium" | "large";
    } & JSX.IntrinsicElements["button"]
>;

export type Theme = {
    button: ForwardRefExoticComponent<
        ButtonProps & RefAttributes<HTMLButtonElement>
    >;
};
