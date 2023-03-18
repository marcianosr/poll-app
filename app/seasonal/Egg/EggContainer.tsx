import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { Title } from "~/ui/Title";
import { ToolTip } from "~/ui/Tooltip";
import { onClickEgg } from "~/utils/easter";
import { Egg, EggProps } from ".";

type EggContainerProps = Pick<EggProps, "size" | "variant" | "id">;

export const EggContainer = ({ variant, id, size }: EggContainerProps) => {
	const { user } = useAuth();
	const { poll, easter } = useLoaderData();
	const isCollected = easter.find((e) =>
		e.eggs.includes(`${poll.category}-${variant}-egg-${id}`)
	);
	const [clicked, setClicked] = useState(false);
	const [showText, setShowText] = useState(false);

	useEffect(() => {
		const id = setTimeout(() => {
			setClicked(false);
		}, 1000);

		return () => clearTimeout(id);
	}, [clicked]);

	console.log(isCollected, id);

	return (
		<div className="egg-main-container">
			{showText && (
				<div
					className={classNames("egg-found-text", {
						"egg-found-text-fade-up": clicked,
					})}
				>
					<Title size="lg" variant="primary">
						{isCollected
							? "You found this one already"
							: "You found an egg!"}
					</Title>
				</div>
			)}
			{user && (
				<Egg
					id={id}
					variant={variant}
					size={size}
					disabled={isCollected}
					onClick={() => {
						setClicked(true);
						setShowText(true);
						if (!isCollected) {
							return onClickEgg({
								variant,
								eggId: `${poll.category}-${variant}-egg-${id}`,
								userId: user.firebase.id,
							});
						}
					}}
				/>
			)}
		</div>
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
	fallbackValue?: React.ReactNode;
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

	return category ? <>{tag[category]}</> : <>{fallbackValue}</>;
};
