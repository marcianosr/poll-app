import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";

export const variants = ["submit", "secondary"] as const;
export const states = ["active", "disabled"] as const;

export type Variants = typeof variants[number];
export type States = typeof states[number];

export type ButtonProps = {
	type?: "button" | "submit";
	onClick?: () => void;
	name?: string;
	value?: string;
	variant: Variants;
	state?: States;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Button = ({
	type = "submit",
	value,
	name,
	variant,
	state,
	onClick,
	children,
}: PropsWithChildren<ButtonProps>) => {
	const styles = classNames(
		"button",
		`button-${variant}`,
		state && `button-${variant}-${state}`
	);
	return (
		<button
			type={type}
			className={styles}
			value={value}
			name={name}
			onClick={onClick}
			disabled={state === "disabled"}
		>
			{children}
		</button>
	);
};
