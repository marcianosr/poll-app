import { FC } from "react";

type Props = {
	onClick: () => void;
};

const Button: FC<Props> = ({ onClick, children }) => {
	return (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
