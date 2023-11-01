import React, { FC, ReactNode } from "react";

interface HeadingProps {
	children: ReactNode,
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Heading: FC<HeadingProps> = (props) => {
	const { children, as: Tag = 'h1'} = props;
	return <Tag>{children}</Tag>;
};
