import styles from "./styles.css";
import { Text } from "../Text";
import { PropsWithChildren } from "react";
import classnames from "classnames";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

const getWinner = (users: any, field: "seasonStreak" | "total" | "correct") => {
	const winner = users
		.filter((a) => a.polls[field])
		.reduce(
			(max, obj) => {
				return max.polls[field] > obj.polls[field] ? max : obj;
			},
			{ polls: { [field]: 0 } }
		);

	const hasWinners = Object.values(winner);
	const winners = hasWinners.length
		? users.filter(
				(user: any) =>
					user.polls[field] === winner.polls[field] &&
					user.polls[field] !== 0
		  )
		: [];

	return winners;
};

type ProfileCardContainerProps = {
	users: any;
	user: any;
	variant: "total" | "correct" | "seasonStreak";
};

export const ProfileCardContainer = ({
	users,
	user,
	variant,
	children,
}: PropsWithChildren<ProfileCardContainerProps>) => (
	<article
		key={user.id}
		className={classnames("profile-container", {
			winner: getWinner(users, variant).find(
				(u: any) => u.email === user.email
			),
		})}
	>
		{children}
	</article>
);

type ProfileCardProps = { user: any; points: number };

export const ProfileCard = ({ user, points }: ProfileCardProps) => {
	return (
		<section className="profile-card">
			<SkewContainer>
				<DisplayName user={user} />
			</SkewContainer>
			<img
				className="user-profile-img"
				alt={user.displayName}
				src={user.photoURL.split("s96-c")[0] + "s300-c"}
			/>
			<SkewContainer>
				<PointsContainer points={points} />
			</SkewContainer>
		</section>
	);
};

type DisplayNameProps = { user: any };

const DisplayName = ({ user }: DisplayNameProps) => (
	<div className="name-container">
		<Text variant="secondary" tag="span" size="md">
			{user.displayName.split(" ")[0]}
		</Text>
		<Text variant="secondary" tag="span" size="md">
			{user.displayName.split(" ")[1]} {user.displayName.split(" ")[2]}
		</Text>
	</div>
);

type PointsContainerProps = { points: number };

const PointsContainer = ({ points }: PointsContainerProps) => (
	<div className="points-container">
		<Text variant="secondary" tag="span" size="md">
			{points}
		</Text>
	</div>
);

const SkewContainer = ({ children }: PropsWithChildren) => (
	<div className="skewed-container">{children}</div>
);
