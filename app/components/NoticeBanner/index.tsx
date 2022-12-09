import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const NoticeBanner = () => (
	<h3 className="notice">
		<span className="emoji">🏋️</span> Lift each other up: Feel free to
		discuss your vote in a slack thread!
	</h3>
);
