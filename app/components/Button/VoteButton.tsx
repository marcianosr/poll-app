import { useTransition } from "@remix-run/react";
import { PollData, Voted } from "~/utils/polls";

type Props = {
	poll: PollData;
	selectedVotes: Voted[];
};

const VoteButton = ({ poll, selectedVotes }: Props) => {
	const transition = useTransition();

	console.log(transition);

	return (
		<button
			disabled={
				poll.status !== "open" ||
				selectedVotes.length === 0 ||
				transition.state === "submitting" ||
				transition.state === "loading"
			}
		>
			{transition.state === "submitting" || transition.state === "loading"
				? "Submitting... No button mashing! NEENER NEENER!"
				: "Submit"}
		</button>
	);
};

export default VoteButton;
