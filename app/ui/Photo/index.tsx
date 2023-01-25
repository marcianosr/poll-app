import { PropsWithChildren } from "react";
import styles from "./styles.css";
import classNames from "classnames";

export type PhotoType = {
	url: string;
};

export type PhotoProps = {
	variant?: "round" | "default";
	size?: "small" | "medium" | "large";
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

	return (
		<img
			className={styles}
			src={photo.url}
			alt={"hallo"}
			width={30}
			height={30}
		/>
	);
};
