import { FC } from "react";
import { NewPollType } from "../PollForm";

type Props = {
	fields: NewPollType[];
	setFields: (fields: NewPollType[]) => void;
	fieldId: string;
};
const DeleteButton: FC<Props> = ({ fieldId, fields, setFields }) => {
	const onDelete = (id: string) =>
		setFields([...fields.filter((field) => field.id !== id)]);

	return <button onClick={() => onDelete(fieldId)}>❌</button>;
};

export default DeleteButton;
