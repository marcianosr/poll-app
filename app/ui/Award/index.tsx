import { Title } from "../Title";
import { Text } from "../Text";
import styles from "./styles.css";
import classnames from "classnames";
import { PhotoList } from "../../ui/PhotoList";
import { Fragment, useState } from "react";
import { HTMLEgg } from "~/seasonal/Egg/EggContainer";

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

export const FakeAward = ({ title, descriptiom }: any) => {
	const [revealEgg, setRevealEgg] = useState(false);

	return (
		<article className={classnames("award")} onClick={setRevealEgg}>
			<Title size="sm" variant="primary" tag="h3">
				{title}
			</Title>
			<Text size="sm" tag="p" variant="primary">
				{descriptiom}
			</Text>

			<>
				<Text size="xs" tag="small" variant="primary">
					owned by
				</Text>
				{!revealEgg ? (
					<Text size="md" variant="rainbow" tag="p">
						Egg Master
					</Text>
				) : (
					<HTMLEgg size="lg" id="3" />
				)}
			</>
		</article>
	);
};

export const FakeRank = ({ title, description }: any) => {
	const [revealEgg, setRevealEgg] = useState(false);

	return (
		<div
			onDoubleClick={setRevealEgg}
			title="IMSORRYFORCAUSINGTROUBLEBUTNOWYOUMUSTCLICKDOUBLE"
		>
			{!revealEgg ? (
				<Award
					title={title}
					description={description}
					variant="photo"
					winners={[]}
					state={"default"}
				/>
			) : (
				<HTMLEgg size="xl" id="4" />
			)}
		</div>
	);
};

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
