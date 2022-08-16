import { FC } from "react";
import { PollStatus } from "../../utils/polls";

type Props = {
	status: PollStatus;
};
const PollStatus: FC<Props> = ({ status }) => (
	<span>
		Status: {status} -{" "}
		{status === "closed" ? (
			<span>it is not possible to submit to the poll anymore</span>
		) : (
			<span>the poll is open for responses!</span>
		)}
	</span>
);

export default PollStatus;
