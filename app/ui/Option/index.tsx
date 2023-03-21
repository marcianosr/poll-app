import { PropsWithChildren } from "react";
import styles from "./styles.css";
import { Text } from "../Text";
import classNames from "classnames";
import { Answer } from "~/utils/polls";

export const variants = [
	"default",
	"active",
	"disabled",
	"correct",
	"wrong",
	"selected",
] as const;
export type Variants = typeof variants[number];

export type OptionProps = {
	variant?: Variants;
	answer: Answer;
	style?: any;
	onMouseOver?: any;
	onMouseOut?: any;
	onClick?: () => void;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Option = ({
	answer,
	variant = "default",
	onClick,
	style,
	onMouseOver,
	onMouseOut,
	children,
}: PropsWithChildren<OptionProps>) => {
	const styles = classNames("option", `option-${variant}`);

	return (
		<label
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			style={style}
			className={styles}
			htmlFor={answer.id}
			onClick={onClick}
		>
			<Text size="md" variant="primary" tag="span">
				{answer.value}
			</Text>
			{children}
		</label>
	);
};
