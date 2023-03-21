import { useTransition } from "@remix-run/react";
import { EggConditional } from "~/seasonal/Egg/EggContainer";
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
				{transition.state === "submitting" &&
					poll.category === "css" && (
						<EggConditional category="css" id="4" size="xs" />
					)}
				{transition.state === "submitting" ||
				transition.state === "loading"
					? "Submitting... Take your easter egg! NEENER NEENER!"
					: "Submit"}
			</div>
		</button>
	);
};

export default VoteButton;
