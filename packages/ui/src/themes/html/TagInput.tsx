import React from "react";
import { forwardRef } from "react";
import { ButtonProps } from "../../components/Button";
import { WithContext as ReactTags } from "react-tag-input";

export const TagInput = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, ...props }, ref) => (
		<button {...props} ref={ref}>
			{children}
		</button>
	)
);
