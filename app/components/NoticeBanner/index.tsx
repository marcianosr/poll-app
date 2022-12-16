import classNames from "classnames";
import { FC } from "react";
import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type Props = {
	variant?: "default" | "sticky";
};

export const NoticeBanner: FC<Props> = ({ variant = "default", children }) => (
	<section className={classNames("notice-container", variant)}>
		{console.log(variant)}
		<h3 className="notice">{children}</h3>
	</section>
);
