import { Title } from "../Title";
import { Text } from "../Text";
import styles from "./styles.css";
import classnames from "classnames";
import { PhotoList } from "../../ui/PhotoList";
import { Fragment } from "react";

export type AwardProps = {
	title: string;
	description: string;
	winners: any;
	state: "default" | "disabled";
	variant: "text" | "photo";
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Award = ({
	title,
	description,
	winners,
	state = "default",
	variant,
}: AwardProps) => (
	<article className={classnames("award", `award-${state}`)}>
		<Title size="sm" variant="primary" tag="h3">
			{title}
		</Title>
		<Text size="sm" tag="p" variant="primary">
			{description}
		</Text>

		{variant === "text" && (
			<>
				{winners.length > 0 &&
					winners.map((winner) => (
						<Fragment key={winner.displayName}>
							<Text size="xs" tag="small" variant="primary">
								owned by
							</Text>
							<Text size="md" variant="rainbow" tag="p">
								{winner.displayName}
							</Text>
						</Fragment>
					))}
			</>
		)}
		{variant === "photo" && winners.length > 0 && (
			<PhotoList
				voters={winners.map((winner) => ({
					photo: { url: winner.photoURL, alt: winner.displayName },
				}))}
			/>
		)}
	</article>
);
