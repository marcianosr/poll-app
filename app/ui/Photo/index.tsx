import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";

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
	const photoSize = {
		small: 30,
		medium: 50,
		large: 100,
	};

	return (
		<img
			className={styles}
			src={photo.url}
			alt={photo.alt || ""}
			width={photoSize[size]}
			height={photoSize[size]}
		/>
	);
};
