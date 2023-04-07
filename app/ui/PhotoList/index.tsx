import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";
import { Photo, PhotoSize } from "../../ui/Photo";
import { VoterType } from "../OptionVotes";

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

	return (
		<ul className={styles}>
			{voters.map((voter) => (
				<li
					{...(voter.photo.alt === "Ronald Aarnoutse" && {
						style: { position: "relative" },
					})}
					key={voter.photo.url}
				>
					<Photo
						photo={{
							url: voter.photo.url || "",
							alt: voter.photo.alt || "",
						}}
						{...variantSettings[variant || "default"]}
					/>
				</li>
			))}
		</ul>
	);
};
