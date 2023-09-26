import type { PropsWithChildren } from "react";
import styles from "./styles.css";
import { Text } from "../Text";
import classNames from "classnames";
import type { Answer } from "~/utils/polls";
import { CodeBlock } from "../CodeBlock";

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
	const styles = classNames("option", `option-${variant}`, {
		"option-codeblock": answer.blockType === "code",
	});

	return (
		<>
			<label
				onMouseOver={onMouseOver}
				onMouseOut={onMouseOut}
				style={style}
				className={styles}
				htmlFor={answer.id}
				onClick={onClick}
			>
				{answer.blockType === "code" && (
					<CodeBlock size="sm" code={answer.value} />
				)}
				{answer.blockType !== "code" && (
					<Text size="md" variant="primary" tag="span">
						{answer.value}
					</Text>
				)}
				{children}
			</label>
		</>
	);
};

type OptionWithPointsProps = {
	points: number;
};

export const OptionWithPoints: React.FC<OptionWithPointsProps> = ({
	points,
}) => (
	<>
		{typeof points === "number" && (
			<div className="option-points">
				<Text size="lg" variant="primary" tag="span">
					{points}
				</Text>
				{points === 0 && (
					<Text size="xs" variant="primary" tag="small">
						{" "}
						(-1)
					</Text>
				)}
				<Text size="xs" variant="primary" tag="p">
					points
				</Text>
			</div>
		)}
	</>
);
