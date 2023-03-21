import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { LoaderData } from "~/routes/polls/$id";
import {
	CSSEgg,
	EggConditional,
	EggContainer,
} from "~/seasonal/Egg/EggContainer";
import { Option, OptionProps } from "~/ui/Option";
import { ToolTip } from "~/ui/Tooltip";

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
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<div style={{ position: "relative" }}>
			{selectable && (
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
			)}
			<Option
				onMouseOver={() => setShowTooltip(true)}
				onMouseOut={() => setShowTooltip(false)}
				{...(poll.category === "css" &&
					idx === 3 && { style: { cursor: "help" } })}
				answer={answer}
				variant={poll.status !== "open" ? "disabled" : "default"}
			/>
			{showTooltip && idx === 3 && poll.category === "css" && (
				<div style={{ position: "absolute", top: "-80px" }}>
					{" "}
					<ToolTip text="Huh?" />
				</div>
			)}

			{poll.category === "css" && idx === 3 && revealEgg && (
				<div style={{ height: "30px" }}>
					<EggConditional category="css" id="3" size="xs" />
				</div>
			)}
		</div>
	);
};
