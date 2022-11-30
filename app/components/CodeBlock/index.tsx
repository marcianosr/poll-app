import type { FC } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import styles from "./styles.css";
import classNames from "classnames";
import { formatLineNumber } from "./formatLineNumber";

type Props = {
	code: string;
	withLineNumbers?: boolean;
	isAnswerField?: boolean;
};

export const links = () => [{ rel: "stylesheet", href: styles }];

export const CodeBlock: FC<Props> = ({
	code,
	withLineNumbers = true,
	isAnswerField = false,
}) => (
	<Highlight {...defaultProps} code={code} language="jsx">
		{({ tokens, getLineProps, getTokenProps }) => {
			const totalLineNumbers = code.split("\n").length;
			return (
				<pre
					className={classNames({
						"text-question-answer": tokens.length === 1,
						"code-block": tokens.length > 1,
					})}
				>
					{tokens.map((line, i) => (
						<div
							{...getLineProps({
								line,
								key: i,
							})}
						>
							<>
								{withLineNumbers && (
									<span className="line">
										{formatLineNumber(
											i,
											totalLineNumbers,
											" "
										)}
									</span>
								)}
								{line.map((token, key) => (
									<span
										{...getTokenProps({
											token,
											key,
										})}
									/>
								))}
							</>
						</div>
					))}
				</pre>
			);
		}}
	</Highlight>
);
