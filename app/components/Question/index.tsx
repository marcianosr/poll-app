import { FC } from "react";
import { Title } from "../../ui/Title";
import styles from "./styles.css";

type Props = {
	title: string;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Question: FC<Props> = ({ title }) => (
	<Title size="lg" variant="primary">
		{title}
	</Title>
);
