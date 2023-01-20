import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";
import { Title } from "../Title";

export type BannerProps = {};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Banner = ({ children }: PropsWithChildren<BannerProps>) => {
	const styles = classNames("banner");
	return (
		<section className={styles}>
			<Title size="md" variant="primary">
				{children}
			</Title>
		</section>
	);
};
