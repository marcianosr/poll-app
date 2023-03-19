import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "~/providers/AuthProvider";
import { Title } from "~/ui/Title";
import { firebaseConfig } from "~/utils/config.client";
import { onClickEgg } from "~/utils/easter";
import { Egg, EggProps } from ".";

type EggContainerProps = Pick<EggProps, "size" | "variant" | "id">;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
export const easterRef = collection(db, "easter");

export const EggContainer = ({ variant, id, size }: EggContainerProps) => {
	const { user } = useAuth();
	const { poll } = useLoaderData();

	const [clicked, setClicked] = useState(false);
	const [eggIsCollected, setEggIsCollected] = useState(false);
	const [eggHasBeenClicked, setEggHasBeenClicked] = useState(false);

	useEffect(() => {
		onSnapshot(easterRef, (snapshot) => {
			const data = snapshot.docs.map((doc) => doc.data());
			const egg = data.find((e) =>
				e.eggs.includes(`${poll.category}-${variant}-egg-${id}`)
			);

			if (egg) {
				setEggIsCollected(true);
			}
		});
	}, [eggIsCollected]);

	useEffect(() => {
		const id = setTimeout(() => {
			setClicked(false);
		}, 3000);

		return () => clearTimeout(id);
	}, [clicked]);

	return (
		<>
			{user && (
				<Egg
					id={id}
					variant={variant}
					size={size}
					disabled={eggIsCollected}
					onClick={() => {
						if (!eggHasBeenClicked) {
							setEggHasBeenClicked(true);
						}
						setClicked(true);
						if (!eggIsCollected) {
							return onClickEgg({
								variant,
								eggId: `${poll.category}-${variant}-egg-${id}`,
								userId: user.firebase.id,
							});
						}
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
