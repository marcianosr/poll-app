import { FC } from "react";
import styles from "./styles.css";

type Props = {
	title: string;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Question: FC<Props> = ({ title }) => (
	<h1 className="question">{title}</h1>
);
