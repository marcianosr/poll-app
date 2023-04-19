import { PropsWithChildren } from "react";
import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type FieldsetProps = {
	title: string;
};
export const Fieldset = ({
	title,
	children,
}: PropsWithChildren<FieldsetProps>) => (
	<fieldset className="fieldset-container">
		<legend className="fieldset-legend">{title}</legend>
		{children}
	</fieldset>
);
