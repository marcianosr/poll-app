import type { FC } from "react";
import type { NewPollType } from "~/admin/components/PollForm";

type Props = {
	fields: NewPollType[];
	setFields: (fields: NewPollType[]) => void;
	fieldId: string;
};
const DeleteButton: FC<Props> = ({ fieldId, fields, setFields }) => {
	const onDelete = (id: string) =>
		setFields([...fields.filter((field) => field.id !== id)]);

	return (
		<button type="button" onClick={() => onDelete(fieldId)}>
			Delete answer
		</button>
	);
};

export default DeleteButton;
