import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";

export type BannerProps = {
	icon?: React.ReactNode;
	size?: "wide" | "default";
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Banner = ({
	icon,
	size = "default",
	children,
}: PropsWithChildren<BannerProps>) => {
	const styles = classNames("banner", `banner-${size}`);
	return (
		<section className={styles}>
			{icon && <span className="icon">{icon}</span>}
			{children}
		</section>
	);
};
