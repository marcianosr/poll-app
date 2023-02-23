import { useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { YourVotes } from "../../compositions/YourVotes";
import { useAuth } from "../../providers/AuthProvider";
import { LoaderData } from "../../routes/polls/$id";
import { Answer } from "../../utils/polls";
import { CodeBlock } from "../../ui/CodeBlock";
import { ResultsList } from "../../compositions/ResultsList";

type Props = {
	getCorrectAnswers: (answerId: string) => boolean;
	currentAnswers: Answer[];
	getVotesFromAllUsers: any;
};
export const ResultsScreen: FC<Props> = ({
	getCorrectAnswers,
	currentAnswers,
	getVotesFromAllUsers,
}) => {
	const { poll } = useLoaderData() as LoaderData;
	const { user } = useAuth();

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
				getVotesFromAllUsers={getVotesFromAllUsers}
			/>

			<YourVotes
				votes={getGivenVotesByUser}
				getCorrectAnswers={getCorrectAnswers}
			/>
		</>
	);
};
