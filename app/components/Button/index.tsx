import { FC } from "react";

type Props = {
	onClick?: () => void;
	type?: "button" | "submit";
	name?: string;
	value: string;
};

const Button: FC<Props> = ({
	name,
	value,
	type = "button",
	onClick,
	children,
}) => {
	return (
		<button type={type} onClick={onClick} name={name} value={value}>
			{children}
		</button>
	);
};

export default Button;
