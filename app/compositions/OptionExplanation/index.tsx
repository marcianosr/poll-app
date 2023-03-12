import { PropsWithChildren, useState } from "react";
import { ToolTip, links as tooltipStyles } from "../../ui/Tooltip";
import styles from "./styles.css";

export type OptionExplanationProps = {
	tooltip: {
		title: string;
		text: string;
	};
	children: (props: { setShow: (show: boolean) => void }) => React.ReactNode;
};

export function links() {
	return [...tooltipStyles(), { rel: "stylesheet", href: styles }];
}

export const OptionExplanation = ({
	tooltip: { title, text },
	children,
}: OptionExplanationProps) => {
	const [show, setShow] = useState(false);
	return (
		<section className="option-explanation-container">
			{show && (
				<ToolTip
					title={title}
					text={text}
					onClose={() => setShow(false)}
				/>
			)}
			{children({ setShow })}
		</section>
	);
};
