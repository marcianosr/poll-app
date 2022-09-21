import classNames from "classnames";
import { FC } from "react";
import { Award } from "../AwardsBoard";
import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type Props = {
	award?: Award;
	setAwardInfo?: (award: Award) => void;
	percentage: number;
};

export const Block: FC<Props> = ({ award, setAwardInfo, percentage }) => {
	if (!award)
		return (
			<span
				className={classNames("block", {
					locked: percentage === 0,
					["level-4"]: percentage > 0 && percentage <= 25,
					["level-3"]: percentage > 25 && percentage <= 50,
					["level-2"]: percentage > 50 && percentage <= 75,
					["level-1"]: percentage > 75,
				})}
			></span>
		);
	return (
		<span
			title={award.name}
			onClick={() => setAwardInfo?.(award)}
			className={classNames("block", {
				locked: percentage === 0,

				["level-4"]: percentage > 0 && percentage < 25,
				["level-3"]: percentage > 25 && percentage < 50,
				["level-2"]: percentage > 50 && percentage < 75,
				["level-1"]: percentage > 75,
			})}
		></span>
	);
};
