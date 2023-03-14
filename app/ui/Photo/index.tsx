import { PropsWithChildren, useState } from "react";
import styles from "./styles.css";
import classNames from "classnames";
import { JSEgg } from "~/seasonal/Egg/EggContainer";

export type PhotoType = {
	url: string;
	alt?: string;
};

export type PhotoVariant = "round" | "default";
export type PhotoSize = "small" | "medium" | "large";

export type PhotoProps = {
	variant?: PhotoVariant;
	size?: PhotoSize;
	photo: PhotoType;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Photo = ({
	variant = "default",
	size = "medium",
	photo,
}: PropsWithChildren<PhotoProps>) => {
	const styles = classNames("photo", `photo-${variant}`, `photo-${size}`);
	const [revealEgg, setRevealEgg] = useState(false);

	return (
		<>
			<img
				className={styles}
				src={photo.url}
				alt={photo.alt || ""}
				width={30}
				height={30}
				onMouseOver={(e) => {
					if (photo.alt === "Ronald Aarnoutse") {
						console.log("Ronald Aarnoutse", e.target);
						setRevealEgg(true);
					}
				}}
			/>
			{revealEgg && (
				<div style={{ position: "absolute", left: 0, top: 0 }}>
					<JSEgg size="sm" id="1" />
				</div>
			)}
		</>
	);
};
