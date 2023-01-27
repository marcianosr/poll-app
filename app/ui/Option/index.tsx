import { PropsWithChildren } from "react";
import styles from "./styles.css";
import { Text } from "../Text";
import classNames from "classnames";
import { useLoaderData } from "@remix-run/react";
import { LoaderData } from "~/routes/polls/$id";
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
	selectable?: boolean;
	isChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Option = ({
	answer,
	variant = "default",
	isChecked,
	selectable,
	children,
}: PropsWithChildren<OptionProps>) => {
	const styles = classNames("option", `option-${variant}`);
	const { poll } = useLoaderData() as LoaderData;

	return (
		<>
			{selectable && (
				<input
					className="input"
					disabled={poll.status !== "open"}
					type={poll.type}
					id={answer.id}
					onChange={isChecked}
					name="answer"
					value={answer.value}
				/>
			)}
			<label className={styles} htmlFor={answer.id}>
				<Text size="md" variant="primary" tag="span">
					{answer.value}
				</Text>
				{children}
			</label>
		</>
	);
};
