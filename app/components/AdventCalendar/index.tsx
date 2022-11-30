import classNames from "classnames";
import { FC, useState } from "react";
import styles from "./styles.css";

type Props = {
	user: any;
	idx: number;
};

export const links = () => [{ rel: "stylesheet", href: styles }];

export const AdventCalendar: FC<Props> = ({ user, idx }) => {
	const [toggleCalendarItem, setToggleCalenderItem] = useState(false);

	return (
		<div className="advent-calendar-item-container">
			<div
				className={classNames("advent-calendar-item", "door", {
					open: toggleCalendarItem,
				})}
				onClick={() => setToggleCalenderItem(!toggleCalendarItem)}
			>
				{!toggleCalendarItem && <span className="number">{idx}</span>}
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
