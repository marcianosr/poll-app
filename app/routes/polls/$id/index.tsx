import React, { Fragment, useEffect, useState } from "react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useTransition,
} from "@remix-run/react";
import {
	Answer,
	Voted,
	getPollById,
	PollData,
	updatePollById,
	getPollsByOpeningTime,
	getAmountOfClosedPolls,
	getAllPolls,
} from "~/utils/polls";
import { FirebaseUserFields, useAuth } from "~/providers/AuthProvider";
import {
	PollStatusInfo,
	links as pollStatusLinks,
} from "~/components/PollStatusInfo";
import { getUserByID, getUsers, updateUserById } from "~/utils/user";
import { DeepPartial } from "~/utils/types";
import styles from "~/styles/poll.css";
import classNames from "classnames";
import {
	Awards,
	links as awardsBoardLinks,
	Ranks,
	UpcomingAwards,
} from "~/components/Awards";
import { Question, links as questionLinks } from "~/components/Question";
import PollStatistics from "~/components/PollStatistics";
import { CodeBlock, links as codeBlockLinks } from "~/components/CodeBlock";
import { getAllSeasons, SeasonAwardData } from "~/utils/seasons";
import { SentByUserText } from "~/components/SentByUserText";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import UserStatistics from "~/components/UserStatistics";

type ScreenState = "poll" | "results";

export type UpdateScore = Omit<DeepPartial<FirebaseUserFields>, "role">;

export function links() {
	return [
		...codeBlockLinks(),
		...awardsBoardLinks(),
		...pollStatusLinks(),
		...questionLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

const findCurrentStreakLength = (streak: boolean[]) => {
	for (let i = 0; i < streak.length; i++) {
		if (!streak[i]) return i;
	}

	return streak.length;
};

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const selectedVotes = formData.get("selectedVotes") as string;
	const uid = formData.get("uid") as string;
	const paramId = params.id || "";
	const parsedVoted = JSON.parse(selectedVotes) as Voted[];

	const polls = (await getPollById(paramId)) as PollData;

	// const getAmountOfCorrectAnswers = polls.correctAnswers.filter((answer) =>
	// 	parsedVoted.find((voted) => answer.id === voted.answerId)
	// ).length;

	const isEveryAnswerCorrect = parsedVoted
		.map((voted) =>
			polls.correctAnswers.find((answer) => answer.id === voted.answerId)
		)
		.every((answer) => answer);

	await updatePollById(paramId, {
		voted: [...polls.voted, ...parsedVoted],
	});

	const currentUser = await getUserByID(uid);
	const pollsStartedByDate = await getPollsByOpeningTime();

	const getVotedPollsByUser = pollsStartedByDate
		.map((poll) =>
			poll.voted
				.filter((vote: Voted) => vote.userId === uid)
				.map((vote: Voted) => vote.userId)
				.filter(
					(userId: string, index: number, array: string[]) =>
						array.indexOf(userId) === index
				)
				.some((userIds: string[]) => userIds.length > 0)
		)
		.slice()
		.reverse();

	await updateUserById<UpdateScore>({
		id: uid,
		polls: {
			answeredById: [...currentUser?.polls.answeredById, paramId],
			total: currentUser?.polls.total + 1,
			seasonStreak: currentUser?.polls.seasonStreak + 1,
			currentStreak: findCurrentStreakLength(getVotedPollsByUser),
			correct: isEveryAnswerCorrect
				? currentUser?.polls.correct + 1
				: currentUser?.polls.correct,
		},
		lastPollSubmit: Date.now(),
	});

	const getUserIdsByVote = parsedVoted.map((votes) => votes.userId).flat();
	const hasVoted = getUserIdsByVote.includes(uid);

	return {
		error: !hasVoted,
	};
};

type LoaderData = {
	poll: PollData;
	polls: PollData[];
	responses: number;
	users: any; // !TODO: type this
	openedPollNumber: number;
	seasons: SeasonAwardData[];
};

export const loader: LoaderFunction = async ({ params }) => {
	const data = await getPollById(params.id || "");
	const polls = await getAllPolls();
	const users = await getUsers();
	const amountOfClosedPolls = await getAmountOfClosedPolls();
	const seasons = await getAllSeasons();
	const openedPollNumber = amountOfClosedPolls + 1; // ! Closed polls + current open poll

	const getUserIdsByVote = data?.voted
		.map((votes: Voted) => votes.userId)
		.flat();

	const responses = new Set([...getUserIdsByVote]).size;

	return { poll: data, responses, users, openedPollNumber, polls, seasons };
};

export const transformToCodeTags = (value: string, idx?: number) => {
	const code = value.split(" ").join(" ");

	if (code.startsWith("```")) {
		const value = code.split("```");
		return <pre key={idx}>{value}</pre>;
	}

	const words = value.split(" ");

	const wrapWords = words.map((word, idx) => {
		if (word.startsWith("`")) {
			return <code key={idx}>{word.split("`")[1]} </code>;
		}

		return <Fragment key={idx}>{word + " "}</Fragment>;
	});

	return wrapWords;
};

export default function PollDetail() {
	const { poll, responses, users, openedPollNumber, polls, seasons } =
		useLoaderData() as LoaderData;
	const { user, isAdmin } = useAuth();
	const action = useActionData();
	const transition = useTransition();

	const [screenState, setScreenState] = useState<ScreenState>("poll");
	const [showVotedBy, setShowVotedBy] = useState(false);

	const [currentAnswers, setCurrentAnswers] = useState(poll.answers);
	const [selectedVotes, setSelectedVotes] = useState<Voted[]>([]);
	const { width, height } = useWindowSize();

	// Can't check this server-side unless uid is stored somewhere in a cookie or something
	const userHasVoted = poll.voted.find(
		(voted) => voted.userId === user?.firebase.id
	);

	useEffect(() => {
		if (userHasVoted) setScreenState("results");
	}, [user?.firebase.id, userHasVoted]);

	const isChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked && poll.type === "radio") {
			return setSelectedVotes([
				...selectedVotes.filter(
					(selected) => selected.answerId === e.target.id
				),
				{
					answerId: e.target.id,
					userId: user?.firebase.id || "empty",
				},
			]);
		}

		if (e.target.checked && poll.type === "checkbox") {
			setSelectedVotes([
				...selectedVotes,
				{
					answerId: e.target.id,
					userId: user?.firebase.id || "empty",
				},
			]);
		} else {
			const selectedPoll = selectedVotes.filter(
				(selected) => selected.answerId !== e.target.id
			);

			setSelectedVotes(selectedPoll);
		}
	};

	//! Re-check this fn
	// const isDefaultChecked = (answer: Answer) => {
	// 	const findVotedAnswer = poll.voted
	// 		.filter((voted) => voted.answerId === answer.id)
	// 		.filter((voted) => voted.userId === user?.firebase.id);

	// 	console.log("find answer", findVotedAnswer);
	// 	return findVotedAnswer.length > 0;
	// };

	const getLengthOfAnswersById = (answerId: string) =>
		poll.voted.filter((voted) => voted.answerId === answerId);

	const getCorrectAnswers = (answerId: string) =>
		!!poll.correctAnswers.find((correct) => correct.id === answerId);

	// ? For future: it would be cool if these functions happen on the server because they can be quite expensive on the frontend. UID on the server is needed
	const getVotesFromAllUsers = (answerId: string) => {
		return (
			poll.voted
				.filter((vote) => vote.answerId === answerId)
				.map((vote) => vote.userId)
				// ! improve
				.map((id) => users.find((user) => user.id === id))
		);
	};
	// ? For future: it would be cool if these functions happen on the server because they can be quite expensive on the frontend. UID on the server is needed
	const getGivenVotesByUser = poll.voted
		.filter((voted) => user?.firebase.id === voted.userId)
		.map((voted) =>
			currentAnswers.find((answer) => answer.id === voted.answerId)
		);

	const getVotersFromToday = poll.voted
		.map((vote) => users.find((user) => user.id === vote.userId))
		.map((user, idx) => (
			<li className="vote-order-list-item">
				<img src={user.photoURL} width={65} height={65} />
				<span className="place">{idx + 1}</span>
			</li>
		));

	return (
		<section
			className={classNames("page-container", {
				[poll.category]: true,
			})}
		>
			{openedPollNumber === 100 && typeof window !== "undefined" && (
				<Confetti
					width={width}
					height={height}
					colors={[
						"#f4c430",
						"#ff00ff",
						"#ace1af",
						"#e34234",
						"#2a52be",
						"#967bb6",
					]}
				/>
			)}
			<aside className="sidebar-info">
				<PollStatusInfo
					status={poll.status}
					openedPollNumber={openedPollNumber}
					pollNumber={poll.pollNumber || 0}
				/>
				{isAdmin && (
					<section className="eekum-bokum-oomenacka">
						<span>Eekum Bokum Oomenacka!</span>
						<input
							type="checkbox"
							id="votedBy"
							onChange={() => setShowVotedBy(!showVotedBy)}
							name="votedBy"
						/>
					</section>
				)}
				<section>
					<h2 className="title">Ranks</h2>
					<Ranks users={users} polls={polls} />
				</section>
			</aside>
			<section className="main-content">
				{isAdmin && <Link to="/polls">Back to list of polls</Link>}

				<Question title={poll.question} />
				{poll.sentInByUser && (
					<SentByUserText name={poll.sentInByUser?.displayName} />
				)}
				{poll.codeSandboxExample && (
					<iframe
						width="100%"
						height="500"
						src={poll.codeSandboxExample}
					/>
				)}
				{screenState === "poll" && (
					<section
						className={classNames({
							pollIsClosed: poll.status !== "open",
						})}
					>
						{poll.codeBlock && (
							<>
								<p>Code example:</p>
								<CodeBlock code={poll.codeBlock} />
							</>
						)}

						{poll.type === "radio" ? (
							<h3 className="notice">
								Only 1 answer can be selected
							</h3>
						) : (
							<h3 className="notice">Multiple can be selected</h3>
						)}
						<Form method="post">
							{action?.error && (
								<span>
									Please at least fill out one answer to
									submit
								</span>
							)}
							{user && (
								<ul className="choices-list">
									{currentAnswers.map(
										(answer, idx: number) => (
											<>
												<li
													key={idx}
													className="option-answer"
												>
													<input
														className="input"
														disabled={
															poll.status !==
															"open"
														}
														type={poll.type}
														id={answer.id}
														onChange={isChecked}
														// checked={isDefaultChecked(answer)}
														name="answer"
														value={answer.value}
													/>

													<label htmlFor={answer.id}>
														{answer.blockType ===
														"code" ? (
															<>
																<CodeBlock
																	withLineNumbers={
																		false
																	}
																	code={
																		answer.value
																	}
																/>
															</>
														) : (
															<span className="text-question-answer">
																{answer.value}
															</span>
														)}
														{showVotedBy &&
															isAdmin && (
																<p>
																	{getVotesFromAllUsers(
																		answer.id
																	).map(
																		(
																			user
																		) => (
																			<strong
																				key={
																					user.id
																				}
																			>
																				{
																					user.email
																				}{" "}
																			</strong>
																		)
																	)}
																</p>
															)}
													</label>
												</li>
											</>
										)
									)}
								</ul>
							)}
							{user && (
								<button
									disabled={
										poll.status !== "open" ||
										selectedVotes.length === 0 ||
										transition.state === "submitting" ||
										transition.state === "loading"
									}
								>
									{transition.state === "submitting" ||
									transition.state === "loading"
										? "Submitting... No button mashing! NEENER NEENER!"
										: "Submit"}
								</button>
							)}
							{!user && (
								<small>
									Please login to submit your answer.
								</small>
							)}
							<input
								type="hidden"
								name="answers"
								defaultValue={JSON.stringify(currentAnswers)}
							/>
							<input
								type="hidden"
								name="selectedVotes"
								defaultValue={JSON.stringify(selectedVotes)}
							/>
							<input
								type="hidden"
								name="uid"
								defaultValue={user?.firebase.id}
							/>
						</Form>
					</section>
				)}
				{screenState === "results" && (
					<>
						<h3>Results for poll #{openedPollNumber}</h3>
						<p className="responses">
							<span className="emoji">🎉</span>
							<span className="amount">{responses}</span> votes on
							this poll{" "}
						</p>

						<ul className="choices-list results">
							{currentAnswers.map((answer, idx) => (
								<li
									key={answer.id}
									className={classNames("option-answer", {
										correct: getCorrectAnswers(answer.id),
										selected: getGivenVotesByUser.find(
											(vote) => vote?.id === answer.id
										),
									})}
								>
									{answer.blockType === "code" ? (
										<div className="text-question-answer result-vote">
											<CodeBlock
												withLineNumbers={false}
												code={answer.value}
											/>
											<small className="amount-of-votes">
												{
													getLengthOfAnswersById(
														answer.id
													).length
												}{" "}
												votes
											</small>
										</div>
									) : (
										<span className="text-question-answer result-vote">
											<span>{answer.value}</span>
											<small className="amount-of-votes">
												{
													getLengthOfAnswersById(
														answer.id
													).length
												}{" "}
												votes
											</small>
											<p>
												{showVotedBy && isAdmin && (
													<>
														{getVotesFromAllUsers(
															answer.id
														).map((user) => (
															<strong
																key={user.id}
															>
																{user.email}{" "}
															</strong>
														))}
													</>
												)}
											</p>
										</span>
									)}
								</li>
							))}
						</ul>

						<section className="your-votes-container">
							<h3>Your votes</h3>
							<h3 className="notice">
								<span className="emoji">🏋️</span> Lift each
								other up: Feel free to discuss your vote in a
								slack thread!
							</h3>

							<section className="your-votes">
								<ul className="choices-list results ">
									{getGivenVotesByUser.map((vote, idx) => (
										<li
											key={vote?.id}
											className={classNames(
												"option-answer",
												{
													correct: getCorrectAnswers(
														vote?.id || ""
													),
													incorrect:
														!getCorrectAnswers(
															vote?.id || ""
														),
												}
											)}
										>
											{vote?.blockType === "code" ? (
												<div className="text-question-answer result-vote">
													<CodeBlock
														code={vote.value}
														withLineNumbers={false}
													/>
												</div>
											) : (
												<span className="text-question-answer result-vote">
													{transformToCodeTags(
														vote?.value || "",
														idx
													)}
												</span>
											)}
										</li>
									))}
								</ul>
							</section>
						</section>
					</>
				)}

				<UserStatistics users={users} />

				<section className="awards-container">
					<h2 className="title">Awards</h2>
					<Awards users={users} polls={polls} seasons={seasons} />
				</section>

				<section className="awards-container">
					<h2 className="title">Upcoming Awards</h2>
					<UpcomingAwards users={users} polls={polls} />
				</section>
				{/* <PollStatistics polls={polls} /> */}
			</section>
			{getVotersFromToday.length > 0 && (
				<aside className="vote-order-sidebar">
					<ol className="vote-order-container">
						<span className="vote-order-title">Today's voters</span>
						{getVotersFromToday}
					</ol>
				</aside>
			)}
		</section>
	);
}
