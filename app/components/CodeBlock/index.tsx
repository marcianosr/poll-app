import { FC } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import styles from "./styles.css";
import classNames from "classnames";

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
		{({ tokens, getLineProps, getTokenProps }) => (
			<pre
				className={classNames({
					["text-question-answer"]: tokens.length === 1,
					["code-block"]: tokens.length > 1,
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
								<span className="line">{i + 1}</span>
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
		)}
	</Highlight>
);
