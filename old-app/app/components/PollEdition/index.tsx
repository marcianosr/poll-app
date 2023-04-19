import { Title } from "~/ui/Title";
import { Text } from "~/ui/Text";
import styles from "./styles.css";

type PollEditionProps = { openedPollNumber: number; pollNumber: number };

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const PollEdition = ({
	openedPollNumber,
	pollNumber,
}: PollEditionProps) => (
	<section className="poll-edition-container">
		<Title size="md" variant="primary" tag="h2">
			Poll #{openedPollNumber}
		</Title>
		<Text size="sm" variant="primary" tag="small">
			(No. {pollNumber})
		</Text>
	</section>
);
