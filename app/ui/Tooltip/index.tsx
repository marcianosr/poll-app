import classNames from "classnames";
import styles from "./styles.css";

type ToolTipProps = {
	title?: string;
	text: string;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const ToolTip = ({ title, text }: ToolTipProps) => (
	<div className={classNames("tooltip")}>
		{title && <h4>{title}</h4>}
		<p>{text}</p>
	</div>
);
