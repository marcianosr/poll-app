import { FC } from "react";

type Props = {
	name: string;
};

export const SentByUserText: FC<Props> = ({ name }) => (
	<small>Poll credit & full responsibility goes to: {name}</small>
);
