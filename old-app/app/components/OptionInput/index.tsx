import { useLoaderData } from "@remix-run/react";
import type { LoaderData } from "~/routes/polls/$id";
import type { OptionProps } from "~/ui/Option";
import { Option } from "~/ui/Option";

export type OptionInputProps = Pick<OptionProps, "answer"> & {
	idx: number;
	selectable?: boolean;
	isChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const OptionInput = ({
	idx,
	answer,
	isChecked,
	selectable,
}: OptionInputProps) => {
	const { poll } = useLoaderData() as LoaderData;

	return (
		<div>
			{selectable && (
				<input
					className="input"
					disabled={poll.status !== "open"}
					type={poll.type}
					id={answer.id}
					onChange={isChecked}
					name="answer"
					value={answer.value}
				/>
			)}
			<Option
				answer={answer}
				variant={poll.status !== "open" ? "disabled" : "default"}
			/>
		</div>
	);
};
