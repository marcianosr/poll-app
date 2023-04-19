import { Button } from "~/ui/Button";
import styles from "./styles.css";

type AddAnswerButtonProps = {
	addField: () => void;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const AddAnswerButton = ({ addField }: AddAnswerButtonProps) => (
	<section className="add-answer-button-container">
		<Button variant="secondary" onClick={addField} type="button">
			Add new answer option
		</Button>
	</section>
);
