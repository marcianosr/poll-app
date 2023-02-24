import styles from "./styles.css";
import { Text } from "~/ui/Text";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Footer = () => (
	<footer className="footer">
		<Text size="sm" variant="primary">
			A web app build with ❤️ &{" "}
			<a href="https://remix.run/" target="_blank">
				Remix
			</a>{" "}
			| EST april 2022 | Contribute or submit an{" "}
			<a href="https://github.com/marcianosr/poll-app/issues/new">
				issue
			</a>
		</Text>
	</footer>
);
