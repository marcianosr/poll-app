import { PropsWithChildren } from "react";
import styles from "./styles.css";

export type BannerBlockProps = {};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const BannerBlock = ({
	children,
}: PropsWithChildren<BannerBlockProps>) => {
	return <section className="banner-block">{children}</section>;
};
