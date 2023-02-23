import classNames from "classnames";
import React, { FC, Fragment, useState } from "react";
import {
	createSeason,
	PollAwardData,
	SeasonAwardData,
	SeasonData,
} from "~/utils/seasons";
import { PollCategory, PollData } from "~/utils/polls";
import styles from "./styles.css";
import { Award, links as awardLinks } from "~/ui/Award";
import { links as textLinks } from "../../ui/Text";
import { Title } from "~/ui/Title";

export const links = () => [
	...textLinks(),
	...awardLinks(),
	{ rel: "stylesheet", href: styles },
];

export const awards = (users: any, polls: PollData[]) => [
	{
		name: "Poll Newbie",
		type: "rank",
		description: "Voted less than 7 times in total",
		requirements: (users: any) => {
			return users.filter((user: any) => user.polls.total <= 7);
		},
	},
	{
		name: "Poll Acquaintance",
		type: "rank",
		description: "Voted more than 7 times in total",
		requirements: (users: any) => {
			return users.filter(
				(user: any) => user.polls.total > 7 && user.polls.total <= 14
			);
		},
	},
	{
		name: "no-stopping-me-now",
		type: "rank",
		description: "Voted more than 14 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 14 && user.polls.total <= 21
			),
	},
	{
		name: "'Long Polling'",
		type: "rank",
		description: "Voted more than 21 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 21 && user.polls.total <= 28
			),
	},
	{
		name: "Poll-a-holic",
		type: "rank",
		description: "Voted more than 28 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 28 && user.polls.total <= 35
			),
	},
	{
		name: "Poll collector",
		type: "rank",
		description: "Voted more than 35 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 35 && user.polls.total <= 46
			),
	},
	{
		name: "Poll Nerdo",
		type: "rank",
		description: "Voted more than 46 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 46 && user.polls.total <= 60
			),
	},
	{
		name: "Permanently plugged in",
		type: "rank",
		description: "Voted more than 60 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 60 && user.polls.total <= 71
			),
	},
	{
		name: "Truly poll addicted",
		type: "rank",
		description: "Voted more than 71 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 71 && user.polls.total <= 82
			),
	},
	{
		name: "Polls are a nerds best friend",
		type: "rank",
		description: "Voted more than 82 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 82 && user.polls.total <= 95
			),
	},
	{
		name: "Poll Elitist",
		type: "rank",
		description: "Voted more than 95 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 95 && user.polls.total <= 115
			),
	},
	{
		name: "PollXtreme",
		type: "rank",
		description: "Voted more than 115 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 115 && user.polls.total <= 133
			),
	},
	{
		name: "Polls treasure trove",
		type: "rank",
		description: "Voted more than 133 times in total",
		requirements: (users: any) =>
			users.filter(
				(user: any) => user.polls.total > 133 && user.polls.total <= 157
			),
	},
	{
		name: "Polls Galore!",
		type: "rank",
		description: "Voted more than 157 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 157),
	},
	{
		name: "HTML Hobbyist",
		type: "award",
		description: "Participated in HTML polls the most",
		requirements: (users: any) =>
			getUserWithMostPollsAnsweredByCategory(users, polls, "html"),
	},
	{
		name: "Markup Master",
		type: "award",
		description: "Have the most correct HTML answers",
		requirements: (users: any) =>
			getUserWithMostCorrectPollsByCategory(users, polls, "html"),
	},
	{
		name: "CSS Connoisseur",
		type: "award",
		description: "Have the most correct CSS answers",
		requirements: (users: any) =>
			getUserWithMostCorrectPollsByCategory(users, polls, "css"),
	},
	{
		name: "Forza Frontend",
		type: "award",
		description: "Have the most correct General Frontend answers",
		requirements: (users: any) =>
			getUserWithMostCorrectPollsByCategory(
				users,
				polls,
				"general-frontend"
			),
	},
	{
		name: "'every()thing' correct",
		type: "award",
		description: "Have the most correct JS answers",
		requirements: (users: any) =>
			getUserWithMostCorrectPollsByCategory(users, polls, "javascript"),
	},
	{
		name: "Type Specialist",
		type: "award",
		description: "Have the most correct TS answers",
		requirements: (users: any) =>
			getUserWithMostCorrectPollsByCategory(users, polls, "typescript"),
	},
	{
		name: "React Rocket",
		type: "award",
		description: "Have the most correct React answers",
		requirements: (users: any) =>
			getUserWithMostCorrectPollsByCategory(users, polls, "react"),
	},
	{
		name: "CSS Carrier",
		type: "award",
		description: "Participated in CSS polls the most",
		requirements: (users: any) =>
			getUserWithMostPollsAnsweredByCategory(users, polls, "css"),
	},
	{
		name: "React 4 U",
		type: "award",
		description: "Participated in React polls the most",
		requirements: (users: any) =>
			getUserWithMostPollsAnsweredByCategory(users, polls, "react"),
	},
	{
		name: "TypeScript Tinkerer",
		type: "award",
		description: "Participated in TypeScript polls the most",
		requirements: (users: any) =>
			getUserWithMostPollsAnsweredByCategory(users, polls, "typescript"),
	},
	{
		name: "Const(ant) voter",
		type: "award",
		description: "Participated in JavaScript polls the most",
		requirements: (users: any) =>
			getUserWithMostPollsAnsweredByCategory(users, polls, "javascript"),
	},
	{
		name: "Frontend Fury",
		type: "award",
		description: "Participated in General Frontend polls the most",
		requirements: (users: any) =>
			getUserWithMostPollsAnsweredByCategory(
				users,
				polls,
				"general-frontend"
			),
	},
	{
		name: "Speed Demon",
		type: "award",
		description:
			"Always being the first answering polls (Can only be earned when you atleast answered the poll 4 times as first)",
		requirements: (users: any) => {
			const NUMBER_OF_POLLS_NEEDED = 4;
			const userIds = polls
				.map((poll) => poll.voted.map((vote) => vote.userId))
				.filter((a) => a);

			const getFirst = userIds.map((id) => id[0]).filter((a) => a);

			const [id] = Object.entries(getHighestOccurenceByIds(getFirst))
				.filter(([key, value]) => value >= NUMBER_OF_POLLS_NEEDED)
				.flat();

			return users.filter((user: any) => user.id === id);
		},
	},
	{
		name: "Lucky number 7",
		type: "award",
		description: "Answered polls as 7th most of the time",
		requirements: (users: any) => {
			const userIds = polls
				.map((poll) => poll.voted.map((vote) => vote.userId))
				.filter((a) => a);

			const getSeventh = userIds.map((id) => id[6]).filter((a) => a);

			const highestOccurence = getSeventh.reduce(
				(previous: { [key: string]: number }, current) => {
					const currCount = previous[current] ?? 0;

					return {
						...previous,
						[current]: currCount + 1,
					};
				},
				{}
			);

			const sorted = Object.entries(highestOccurence)
				.sort((a, b) => b[1] - a[1])
				.flat();

			return users.filter((user: any) => user.id === sorted[0]);
		},
	},
	{
		name: "No Hurry",
		type: "award",
		description: "Always the last one to answer the polls",
		requirements: (users: any) => {
			const userIds = polls
				.map((poll) => poll.voted.map((vote) => vote.userId))
				.filter((a) => a);

			const getLast = userIds
				.map((id) => id[id.length - 1])
				.filter((a) => a);

			const highestOccurence = getLast.reduce(
				(previous: { [key: string]: number }, current) => {
					const currCount = previous[current] ?? 0;

					return {
						...previous,
						[current]: currCount + 1,
					};
				},
				{}
			);

			const sorted = Object.entries(highestOccurence)
				.sort((a, b) => (b[1] as number) - (a[1] as number))
				.flat();

			return users.filter((user: any) => user.id === sorted[0]);
		},
	},
	{
		name: "King of the rock",
		type: "award",
		description: "Have the highest total polls of the season",
		requirements: (users: any) => {
			const winner = users
				.filter((a) => a.polls.seasonStreak)
				.reduce(
					(max, obj) => {
						return max.polls.seasonStreak > obj.polls.seasonStreak
							? max
							: obj;
					},
					{ polls: { seasonStreak: 0 } }
				);
			const hasWinners = Object.values(winner);
			const winners = hasWinners.length
				? users.filter(
						(user: any) =>
							user.polls.seasonStreak ===
								winner.polls.seasonStreak &&
							user.polls.seasonStreak !== 0
				  )
				: [];

			return winners;
		},
	},
	{
		name: "Black Sheep",
		type: "award",
		upcoming: true,
		description: "Being the only one voting for the correct answer",
		requirements: (users: any) => {
			return [];
		},
	},
	{
		name: "Jack of all-trades",
		type: "award",
		upcoming: true,
		description:
			"Participated in all poll categories but doesn't have a specialism award",
		requirements: (users: any) => {
			return [];
		},
	},
	{
		name: "Rock Steady",
		type: "award",
		upcoming: true,
		description: "Have the highest season streak of participation in polls",
		requirements: (users: any) => {
			return [];
		},
	},
	{
		name: "Oracle of Seasons",
		type: "award",
		upcoming: true,
		description:
			"Have the highest season streak of participation and correct polls",
		requirements: (users: any) => {
			return [];
		},
	},
];

const getHighestOccurenceByIds = (array: string[]) => {
	const counts: Record<string, number> = {};

	for (const num of array) {
		counts[num] = counts[num] ? counts[num] + 1 : 1;
	}

	return counts;
};

const getUserWithMostCorrectPollsByCategory = (
	users: any,
	polls: PollData[],
	category: PollCategory
) => {
	const allPolls = polls.filter((poll) => poll.category === category);
	const correctAnswers = allPolls.map((polls) => polls.correctAnswers).flat();

	const voted = allPolls.map((polls) => polls.voted).flat();

	const userIds = voted
		.filter((vote) =>
			correctAnswers.find((correct) => vote.answerId === correct.id)
		)
		.map((data) => users.find((user: any) => user.id === data.userId))
		// ! Inspect this .filter later as why it is needed.
		// ! Remove: and update local database users
		.filter((u) => u)
		.map((u) => u.id)
		.filter((u) => u);

	const id = userIds.reduce((previous, current, i, arr) => {
		return arr.filter((item) => item === previous).length >
			arr.filter((item) => item === current).length
			? previous
			: current;
	}, "");

	return users.filter((user: any) => user.id === id);
};

const getUserWithMostPollsAnsweredByCategory = (
	users: any,
	polls: PollData[],
	category: PollCategory
) => {
	const allPolls = polls.filter((poll) => poll.category === category);

	const userIds = allPolls
		.filter((polls) => polls.voted.length > 0)
		.map((polls) => polls.voted.map((vote) => vote.userId))
		.flat();

	const id = userIds.reduce((previous, current, i, arr) => {
		return arr.filter((item) => item === previous).length >
			arr.filter((item) => item === current).length
			? previous
			: current;
	}, "");

	return users.filter((user: any) => user.id === id);
};

type Props = {
	users: any;
	polls: PollData[];
};

export type AwardProps = Props & {
	seasons: SeasonAwardData[];
};

export type Award = {
	name: string;
	type: "award";
	requirements: (users: any, polls: PollData[]) => string[];
	description: string;
};

export const Awards: FC<AwardProps> = ({ users, polls }) => (
	<section className="awards">
		{awards(users, polls)
			.filter((award) => award.type === "award")
			.filter((award) => !award.upcoming)
			.map((award) => (
				<Award
					title={award.name}
					description={award.description}
					winners={
						award.requirements(users).map((user: any) => user) || []
					}
					variant="text"
					state={
						award.requirements(users).length === 0
							? "disabled"
							: "default"
					}
				/>
			))}
	</section>
);

export const Ranks: FC<Props> = ({ users, polls }) => {
	return (
		<section>
			{awards(users, polls)
				.filter((award) => award.type === "rank")
				.map((award) => {
					return (
						<Award
							title={award.name}
							description={award.description}
							winners={award
								.requirements(users)
								.map((user) => user)}
							variant="photo"
							state={
								award.requirements(users).length === 0
									? "disabled"
									: "default"
							}
						/>
					);
				})}
		</section>
	);
};
