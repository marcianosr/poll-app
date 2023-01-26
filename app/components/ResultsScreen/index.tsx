import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { FC } from "react";
import { YourVotes } from "../../compositions/YourVotes";
import { useAuth } from "../../providers/AuthProvider";
import { LoaderData } from "../../routes/polls/$id";
import { Answer } from "../../utils/polls";
import { CodeBlock } from "../CodeBlock";
import { ResultsList } from "../../compositions/ResultsList";

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
			currentAnswers.find(
				(answer: Answer) => answer.id === voted.answerId
			)
		);

	return (
		<>
			<ResultsList
				currentAnswers={currentAnswers}
				getCorrectAnswers={getCorrectAnswers}
				getGivenVotesByUser={getGivenVotesByUser}
			/>

			<YourVotes
				votes={getGivenVotesByUser}
				getCorrectAnswers={getCorrectAnswers}
			/>
		</>
	);
};
