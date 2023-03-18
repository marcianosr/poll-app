import { PropsWithChildren, useState } from "react";
import styles from "./styles.css";
import classNames from "classnames";
import { Photo, PhotoSize } from "../../ui/Photo";
import { VoterType } from "../OptionVotes";
import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "~/routes/polls/$id";
import { EggConditional } from "~/seasonal/Egg/EggContainer";
import { ToolTip } from "../Tooltip";

type PhotoListVariant = "chips" | "default";

export type PhotoListProps = {
	variant?: PhotoListVariant;
	voters: VoterType[];
};

type PhotoVariantSettings = {
	[key in PhotoListVariant]: {
		size: PhotoSize;
		variant: "round" | "default";
	};
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const PhotoList = ({
	variant = "default",
	voters,
}: PropsWithChildren<PhotoListProps>) => {
	const styles = classNames("photo-list", `photo-list-${variant}`);
	const variantSettings: PhotoVariantSettings = {
		chips: {
			size: "small",
			variant: "round",
		},
		default: {
			size: "medium",
			variant: "default",
		},
	};

	const [revealEgg, setRevealEgg] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const { poll } = useLoaderData() as LoaderData;

	return (
		<ul className={styles}>
			{voters.map((voter) => (
				<li
					{...(voter.photo.alt === "Ronald Aarnoutse" && {
						style: { position: "relative" },
					})}
					key={voter.photo.url}
					onMouseEnter={(e) => {
						console.log("mous e enter");
						if (voter.photo.alt === "Ronald Aarnoutse") {
							setShowTooltip(true);
						}
					}}
					onMouseLeave={(e) => {
						if (voter.photo.alt === "Ronald Aarnoutse") {
							setShowTooltip(false);
						}
					}}
					onClick={(e) => {
						if (voter.photo.alt === "Ronald Aarnoutse") {
							console.log("Clcik");
							setRevealEgg(true);
						}
					}}
				>
					<Photo
						photo={{
							url: voter.photo.url || "",
							alt: voter.photo.alt || "",
						}}
						{...variantSettings[variant || "default"]}
					/>
					{poll.category === "javascript" &&
						showTooltip &&
						voter.photo.alt === "Ronald Aarnoutse" && (
							<div
								style={{
									position: "absolute",
									top: "-50%",
									left: "-250%",
								}}
							>
								<ToolTip text="HEY! THAT TICKLES! KNOCK IT OFF!" />
							</div>
						)}

					{poll.category === "javascript" &&
						revealEgg &&
						voter.photo.alt === "Ronald Aarnoutse" && (
							<div style={{ position: "absolute" }}>
								<h1>hi</h1>
								<EggConditional
									{...(poll.category === "javascript" && {
										category: "js",
									})}
									id="4"
									size="xs"
								/>
							</div>
						)}
				</li>
			))}
		</ul>
	);
};
