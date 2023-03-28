import classNames from "classnames";
import { PropsWithChildren } from "react";
import styles from "./styles.css";

export const sizes = ["xl", "lg", "md", "md-sm", "sm"] as const;
export const variants = ["primary", "secondary"] as const;
export const tags = ["h1", "h2", "h3", "span"] as const;

export type Sizes = typeof sizes[number];
export type Variants = typeof variants[number];
export type Tags = typeof tags[number];

export type TitleProps = {
	variant: Variants;
	size: Sizes;
	tag?: Tags;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Title = ({
	variant,
	size,
	tag = "h1",
	children,
}: PropsWithChildren<TitleProps>) => {
	const Tag = tag;
	const styles = classNames("title", `title-${variant}`, `title-${size}`);

	return <Tag className={styles}>{children}</Tag>;
};
