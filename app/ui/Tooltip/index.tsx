import classNames from "classnames";
import styles from "./styles.css";

type ToolTipProps = {
	onClose?: () => void;
	title?: string;
	text: string;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const ToolTip = ({ title, text, onClose }: ToolTipProps) => (
	<div className={classNames("tooltip")}>
		{onClose && (
			<button className="tooltip-button" onClick={onClose}>
				X
			</button>
		)}
		{title && <h4>{title}</h4>}
		<p>{text}</p>
	</div>
);
