import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { ToolTip } from "~/ui/Tooltip";
import { onClickEgg } from "~/utils/easter";
import { getPollById, PollData } from "~/utils/polls";
import { Egg, EggProps } from ".";
import { Text } from "../../ui/Text";

type EggContainerProps = Pick<EggProps, "size" | "variant" | "id">;

export const EggContainer = ({ variant, id, size }: EggContainerProps) => {
	const { user } = useAuth();
	const { poll } = useLoaderData();

	return (
		<>
			{/* <ToolTip>Oh?! You found an egg! Click it to collect it!</ToolTip> */}
			{user && (
				<Egg
					id={id}
					variant={variant}
					size={size}
					onClick={() => {
						onClickEgg({
							variant,
							eggId: `${poll.category}-${variant}-egg-${id}`,
							userId: user.firebase.id,
						});
					}}
				/>
			)}
		</>
	);
};

export const HTMLEgg = ({
	id,
	size,
}: Pick<EggContainerProps, "id" | "size">) => {
	const { poll } = useLoaderData();

	return poll.category === "html" ? (
		<EggContainer variant="red" id={id} size={size} />
	) : null;
};

export const CSSEgg = ({
	id,
	size,
}: Pick<EggContainerProps, "id" | "size">) => {
	const { poll } = useLoaderData();

	return poll.category === "css" ? (
		<EggContainer variant="blue" id={id} size={size} />
	) : null;
};

export const JSEgg = ({ id, size }: Pick<EggContainerProps, "id" | "size">) => {
	const { poll } = useLoaderData();

	return poll.category === "javascript" ? (
		<EggContainer variant="yellow" id={id} size={size} />
	) : null;
};

type EggConditionalProps = {
	category?: "html" | "css" | "js";
	fallbackValue: React.ReactNode;
	id: string;
	size: EggProps["size"];
};

export const EggConditional = ({
	category,
	fallbackValue,
	...props
}: EggConditionalProps) => {
	const tag = {
		html: <HTMLEgg {...props} />,
		css: <CSSEgg {...props} />,
		js: <JSEgg {...props} />,
	};

	return category ? <>{tag[category]}</> : <>{fallbackValue} </>;
};

{
	/* <HTMLEgg id="1" size="xs" />; */
}

// ? <HTMLEgg id="1" size="xs" /> : "❤️"
