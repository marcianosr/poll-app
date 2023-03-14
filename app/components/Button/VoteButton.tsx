import { useTransition } from "@remix-run/react";
import { CSSEgg } from "~/seasonal/Egg/EggContainer";
import { PollData, Voted } from "~/utils/polls";

type Props = {
	poll: PollData;
	selectedVotes: Voted[];
};

const VoteButton = ({ poll, selectedVotes }: Props) => {
	const transition = useTransition();

	return (
		<button
			disabled={
				poll.status !== "open" ||
				selectedVotes.length === 0 ||
				transition.state === "submitting" ||
				transition.state === "loading"
			}
		>
			<div style={{ display: "flex", justifyContent: "center" }}>
				{poll.category === "css" && <CSSEgg id="1" size="xs" />}
				{transition.state === "submitting" ||
				transition.state === "loading"
					? "Submitting... No button mashing! NEENER NEENER!"
					: "Submit"}
			</div>
		</button>
	);
};

export default VoteButton;
