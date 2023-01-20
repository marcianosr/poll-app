import { PropsWithChildren } from "react";
import styles from "./styles.css";
import { Text } from "../Text";
import classNames from "classnames";

export const variants = ["default", "active", "disabled"] as const;
export type Variants = typeof variants[number];

export type OptionProps = {
	variant: Variants;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Option = ({
	variant = "default",
	children,
}: PropsWithChildren<OptionProps>) => {
	const styles = classNames("option", `option-${variant}`);
	return (
		<label className={styles}>
			<Text size="md" variant="primary" tag="span">
				{children}
			</Text>
		</label>
	);
};
