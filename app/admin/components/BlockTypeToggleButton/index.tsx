import { BlockType, NewPollType } from "../PollForm";

type BlockTypeToggleButtonProps = {
	blockType?: BlockType;
	field: NewPollType;
	fields: NewPollType[];
	setFields: React.Dispatch<React.SetStateAction<NewPollType[]>>;
};

export const BlockTypeToggleButton = ({
	blockType,
	field,
	fields,
	setFields,
}: BlockTypeToggleButtonProps) => {
	const changeBlockType = (
		e: React.MouseEvent<HTMLButtonElement>,
		field: NewPollType
	) => {
		e.preventDefault();

		return setFields((prev) =>
			fields.map<NewPollType>((f, idx) =>
				f.id === field.id
					? {
							...f,
							blockType:
								prev[idx].blockType === "text"
									? "code"
									: "text",
					  }
					: f
			)
		);
	};

	return (
		<button
			type="button"
			className="toggle-code-button"
			onClick={(e) => changeBlockType(e, field)}
		>
			use {blockType === "text" ? "code" : "text"} answer
		</button>
	);
};
