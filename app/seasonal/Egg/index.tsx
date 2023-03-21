import styles from "./styles.css";
import redEgg from "public/easter/red-egg.png";
import yellowEgg from "public/easter/yellow-egg.png";
import cyanEgg from "public/easter/cyan-egg.png";
import greenEgg from "public/easter/green-egg.png";
import pinkEgg from "public/easter/pink-egg.png";
import blueEgg from "public/easter/blue-egg.png";
import classNames from "classnames";

const imageUrls = {
	red: redEgg,
	yellow: yellowEgg,
	cyan: cyanEgg,
	green: greenEgg,
	pink: pinkEgg,
	blue: blueEgg,
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export type EggVariant = "red" | "yellow" | "cyan" | "green" | "pink" | "blue";
export type EggProps = {
	id?: string;
	variant: EggVariant;
	size: "xs" | "sm" | "md" | "lg" | "xl";
	disabled?: boolean;
	onClick?: (e: React.MouseEvent) => void;
};

export const Egg = ({ id, variant, size, disabled, onClick }: EggProps) => (
	<div
		id={id}
		className={classNames(
			"egg-container",
			`egg-${variant}`,
			`egg-${size}`,
			{
				"egg-disabled": disabled,
			}
		)}
		onClick={onClick}
	>
		<img src={imageUrls[variant]} />
	</div>
);
