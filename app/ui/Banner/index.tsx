import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";

export type BannerProps = {};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Banner = ({ children }: PropsWithChildren<BannerProps>) => {
	const styles = classNames("banner");
	return <section className={styles}>{children}</section>;
};
