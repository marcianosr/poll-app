import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "./styles.css";

export const sizes = ["xl", "md", "sm", "lg", "xs"] as const;
export const variants = ["primary", "secondary", "rainbow"] as const;
export const tags = ["p", "small", "span"] as const;

export type Sizes = typeof sizes[number];
export type Variants = typeof variants[number];
export type Tags = typeof tags[number];

export type TextProps = {
	variant: Variants;
	size: Sizes;
	tag?: Tags;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Text = ({
	variant,
	size,
	tag = "p",
	children,
}: PropsWithChildren<TextProps>) => {
	const Tag = tag;
	const styles = classNames("text", `text-${variant}`, `text-${size}`);

	return <Tag className={styles}>{children}</Tag>;
};
