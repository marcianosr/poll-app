import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

type BadgeProps = {
	onClick: () => void;
};

export const Badge = ({ onClick }: BadgeProps) => (
	<div className="badge-container" onClick={onClick}>
		<div className="badge-text">i</div>
	</div>
);
