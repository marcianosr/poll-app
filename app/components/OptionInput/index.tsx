import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { LoaderData } from "~/routes/polls/$id";
import { CSSEgg } from "~/seasonal/Egg/EggContainer";
import { Option, OptionProps } from "~/ui/Option";

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
	const [revealEgg, setRevealEgg] = useState(false);

	return (
		<>
			{selectable && (
				<>
					<input
						className="input"
						disabled={poll.status !== "open"}
						type={poll.type}
						id={answer.id}
						onChange={isChecked}
						name="answer"
						value={answer.value}
						onClick={setRevealEgg}
					/>
					{poll.category === "css" && idx === 3 && revealEgg && (
						<div style={{ height: "30px" }}>
							<CSSEgg id="3" size="xs" />
						</div>
					)}
				</>
			)}
			<Option
				answer={answer}
				variant={poll.status !== "open" ? "disabled" : "default"}
			/>
		</>
	);
};
