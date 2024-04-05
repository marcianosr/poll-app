import { Button } from "~/ui/Button";
import type { NewPollType } from "../PollForm";

type AddExplanationFieldButtonProps = {
	field: NewPollType;
	addField: (field: NewPollType) => void;
};

export const AddExplanationFieldButton = ({
	field,
	addField,
}: AddExplanationFieldButtonProps) => (
	<Button type="button" variant="submit" onClick={() => addField(field)}>
		➕ ℹ️
	</Button>
);
