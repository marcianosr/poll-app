import React, { PropsWithChildren, forwardRef } from "react";
import { useThemedElement } from "../../theming/useThemedElement";

export type ButtonProps = PropsWithChildren<
	{
		/**
		 * This prop is just as test, the real interface props are not defined yet.
		 */
		size?: "small" | "medium" | "large";
	} & JSX.IntrinsicElements["button"]
>;

export const TagInput = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, ...props }, ref) => {
		const ThemedButton = useThemedElement("button");
		return (
			<ThemedButton ref={ref} {...props}>
				{children}
			</ThemedButton>
		);
	}
);
