import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { FC } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { LoaderData, transformToCodeTags } from "~/routes/polls/$id";
import { Answer } from "~/utils/polls";
import { CodeBlock } from "../CodeBlock";
import { NoticeBanner } from "../NoticeBanner";

type Props = {
	getCorrectAnswers: (answerId: string) => boolean;
	currentAnswers: Answer[];
	showVotedBy: boolean;
	getVotesFromAllUsers: any;
};
export const ResultsScreen: FC<Props> = ({
	getCorrectAnswers,
	currentAnswers,
	showVotedBy,
	getVotesFromAllUsers,
}) => {
	const { poll, responses, openedPollNumber } = useLoaderData() as LoaderData;
	const { user, isAdmin } = useAuth();

	// ? For future: it would be cool if these functions happen on the server because they can be quite expensive on the frontend. UID on the server is needed
	const getGivenVotesByUser = poll.voted
		.filter((voted) => user?.firebase.id === voted.userId)
		.map((voted) =>
			currentAnswers.find((answer) => answer.id === voted.answerId)
		);

	const getLengthOfAnswersById = (answerId: string) =>
		poll.voted.filter((voted) => voted.answerId === answerId);

	return (
		<>
			<h3>Results for poll #{openedPollNumber}</h3>
			<p className="responses">
				<span className="emoji">🎉</span>
				<span className="amount">{responses}</span> votes on this poll{" "}
			</p>

			<ul className="choices-list results">
				{currentAnswers.map((answer) => (
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
									{getLengthOfAnswersById(answer.id).length}{" "}
									votes
								</small>
							</div>
						) : (
							<span className="text-question-answer result-vote">
								<span>{answer.value}</span>
								<small className="amount-of-votes">
									{getLengthOfAnswersById(answer.id).length}{" "}
									votes
								</small>
								{showVotedBy && isAdmin && (
									<>
										{getVotesFromAllUsers(answer.id).map(
											(user) => (
												<strong key={user.id}>
													{user.email}{" "}
												</strong>
											)
										)}
									</>
								)}
							</span>
						)}
					</li>
				))}
			</ul>

			<section className="your-votes-container">
				<h3>Your votes</h3>
				<NoticeBanner>
					<span className="emoji">🏋️</span> Lift each other up: Feel
					free to discuss your vote in a slack thread!
				</NoticeBanner>

				<section className="your-votes">
					<ul className="choices-list results ">
						{getGivenVotesByUser.map((vote, idx) => (
							<li
								key={vote?.id}
								className={classNames("option-answer", {
									correct: getCorrectAnswers(vote?.id || ""),
									incorrect: !getCorrectAnswers(
										vote?.id || ""
									),
								})}
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
	);
};
