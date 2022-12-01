import classNames from "classnames";
import type { FC } from "react";
import { useState } from "react";
import styles from "./styles.css";
import twinkly from "public/00003158.png";
import { colors } from "~/utils/colors";

type Props = {
	user: any;
	idx: number;
	voted: any;
};

export const links = () => [{ rel: "stylesheet", href: styles }];

const getTodaysUserVotes = (voted: any, user: any) =>
	!!voted.find((vote: any) => user.id === vote.userId);

export const AdventCalendar: FC<Props> = ({ user, idx, voted }) => {
	const [toggleCalendarItem, setToggleCalenderItem] = useState(false);

	return (
		<div className="advent-calendar-item-container">
			<div
				className={classNames("advent-calendar-item", "door", {
					open: toggleCalendarItem,
				})}
				onClick={() => setToggleCalenderItem(!toggleCalendarItem)}
			>
				{!toggleCalendarItem && (
					<span className="door-number">{idx}</span>
				)}
			</div>
			<div
				className="twinkly-container"
				style={
					{
						"--twinklyColor":
							colors[Math.floor(Math.random() * colors.length)],
					} as any
				}
			>
				<img
					src={twinkly}
					className={classNames("twinkly", {
						glow: getTodaysUserVotes(voted, user),
					})}
				/>
			</div>
			<img
				onClick={() => setToggleCalenderItem(!toggleCalendarItem)}
				className={classNames("advent-calendar-img", {
					open: toggleCalendarItem,
				})}
				src={user.photoURL.split("s96-c")[0] + "s300-c"}
			/>
			{toggleCalendarItem && (
				<div className="candy-cane-name-container">
					<div className="candy-cane-name">
						<div className="inner-container">
							<span>{user.displayName}</span>
							<span>{user.polls.seasonStreak}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
