import classNames from "classnames";
import React, { FC, Fragment, useState } from "react";
import { PollCategory, PollData } from "~/utils/polls";
import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

const awards = (users: any, polls: PollData[]) => [
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
			return users.filter((user: any) => user.polls.total > 7);
		},
	},
	{
		name: "no-stopping-me-now",
		type: "rank",
		description: "Voted more than 14 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 14),
	},
	{
		name: "'Long Polling'",
		type: "rank",
		description: "Voted more than 21 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 21),
	},
	{
		name: "Poll-a-holic",
		type: "rank",
		description: "Voted more than 28 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 28),
	},
	{
		name: "Poll collector",
		type: "rank",
		description: "Voted more than 35 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 35),
	},
	{
		name: "Poll Nerdo",
		type: "rank",
		description: "Voted more than 46 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 46),
	},
	{
		name: "Permanently plugged in",
		type: "rank",
		description: "Voted more than 60 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 60),
	},
	{
		name: "Truly poll addicted",
		type: "rank",
		description: "Voted more than 71 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 71),
	},
	{
		name: "Polls are a nerds best friend",
		type: "rank",
		description: "Voted more than 82 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 82),
	},
	{
		name: "Polls Galore!",
		type: "rank",
		description: "Voted more than 95 times in total",
		requirements: (users: any) =>
			users.filter((user: any) => user.polls.total > 95),
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
				"general frontend"
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
				"general frontend"
			),
	},
	{
		name: "Speed Demon",
		type: "award",
		description:
			"Always being the first answering polls (Can only be earned when you atleast answered the poll 7 times as first)",
		requirements: (users: any) => {
			const NUMBER_OF_POLLS_NEEDED = 7;
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
		description: "Answered polls as 7th the most",
		requirements: (users: any) => {
			const userIds = polls
				.map((poll) => poll.voted.map((vote) => vote.userId))
				.filter((a) => a);

			const getSeventh = userIds.map((id) => id[6]).filter((a) => a);

			const [id] = Object.entries(
				getHighestOccurenceByIds(getSeventh)
			).flat();

			return users.filter((user: any) => user.id === id);
		},
	},
	{
		name: "King of the rock",
		type: "award",
		description: "Have the highest total polls",
		requirements: (users: any) => {
			const userWithHighestTotal = users.reduce(
				(prev, curr) => {
					return prev.polls.total > curr.polls.total ? prev : curr;
				},
				{ polls: { total: 0 } }
			);

			return [userWithHighestTotal];
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

export type Award = {
	name: string;
	type: "award";
	requirements: (users: any, polls: PollData[]) => string[];
	description: string;
};

export const Awards: FC<Props> = ({ users, polls }) => {
	return (
		<section className="awards">
			{awards(users, polls)
				.filter((award) => award.type === "award")
				.map((award) => (
					<Fragment key={award.name}>
						<div
							className={classNames({
								locked: award.requirements(users).length === 0,
							})}
						>
							<h3 className="subtitle">{award.name}</h3>
							<small>{award.description}</small>
							{award
								.requirements(users)
								// Remove users who participated in "kabisa" poll
								.filter((user) => user.polls.total !== 0)
								.map((user: any) => {
									return (
										<small
											key={user.id}
											className="owned-by"
										>
											Owned by{" "}
											<span className="username colored-name">
												{user.displayName}
											</span>
										</small>
									);
								})}
						</div>
					</Fragment>
				))}
		</section>
	);
};

export const Ranks: FC<Props> = ({ users, polls }) => {
	return (
		<section>
			{awards(users, polls)
				.filter((award) => award.type === "rank")
				.map((award) => {
					return (
						<Fragment key={award.name}>
							<div
								className={classNames({
									locked:
										award.requirements(users).length === 0,
								})}
							>
								<h3 className="subtitle">{award.name}</h3>
								<small>{award.description}</small>
							</div>
							<section className="photo-container">
								{award
									.requirements(users)
									// Remove users who participated in "kabisa" poll
									.filter((user) => user.polls.total !== 0)
									.map((user: any) => {
										return (
											<img
												className="photo"
												key={user.id}
												src={user.photoURL}
												alt={`Photo of ${user.displayName}`}
											/>
											// <small>{user.displayName}</small>
										);
									})}
							</section>
						</Fragment>
					);
				})}
		</section>
	);
};
