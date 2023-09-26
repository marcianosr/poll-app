import type { FC } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import styles from "./styles.css";
import textStyles from "../Text/styles.css";
import classNames from "classnames";
import type { Sizes } from "../Text";

type Props = {
	code: string;
	withLineNumbers?: boolean;
	size: Sizes;
};

export const links = () => [
	{ rel: "stylesheet", href: styles },
	{ rel: "stylesheet", href: textStyles },
];

export const CodeBlock: FC<Props> = ({
	code,
	withLineNumbers = true,
	size = "md",
}) => (
	<Highlight {...defaultProps} code={code} language="jsx">
		{({ tokens, getLineProps, getTokenProps }) => {
			const totalLineNumbers = code.split("\n").length;
			const lineNumberWidth = `${totalLineNumbers}`.length + 1;
			return (
				<pre className={classNames(`text-${size}`)}>
					{tokens.map((line, i) => (
						<div
							{...getLineProps({
								line,
							})}
							key={i}
						>
							<>
								{withLineNumbers && (
									<span
										className="line"
										style={{
											width: `${lineNumberWidth}ch`,
										}}
									>
										{i + 1}
									</span>
								)}
								{line.map((token, key) => (
									<span
										{...getTokenProps({
											token,
											key,
										})}
										key={key}
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
