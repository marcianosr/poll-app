import { useLoaderData } from "@remix-run/react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "~/providers/AuthProvider";
import Popup from "~/ui/Popup";
import { Title } from "~/ui/Title";
import { Text } from "~/ui/Text";
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
	const ref = useRef<Element | null>(null);
	const [mounted, setMounted] = useState(false);

	const [eggIsCollected, setEggIsCollected] = useState(false);
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		ref.current = document.querySelector<HTMLElement>(".page-container");
		setMounted(true);
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(easterRef, (snapshot) => {
			const data = snapshot.docs.map((doc) => doc.data());
			const userEggs = data.find(
				(doc) => doc.userId === user?.firebase.id
			) || { eggs: [] };

			const isEggCollected = userEggs.eggs.includes(
				`${poll.category}-${variant}-egg-${id}`
			);

			if (isEggCollected) {
				setEggIsCollected(true);
			}
		});

		return () => unsubscribe();
	}, [user, eggIsCollected]);

	return (
		<>
			{mounted &&
				ref.current &&
				createPortal(
					<Popup isOpen={showPopup}>
						<Title size="xl" variant="primary" tag="h3">
							You found {variant} easter egg #{id}!
						</Title>
						<Text size="sm" variant="primary">
							This definitely helps you to get a higher score when
							answering questions!
						</Text>
						<Egg id={id} variant={variant} size={"xl"} />
					</Popup>,
					ref.current
				)}
			{user && (
				<Egg
					id={id}
					variant={variant}
					size={size}
					disabled={eggIsCollected}
					onClick={() => {
						if (!eggIsCollected) {
							onClickEgg({
								variant,
								eggId: `${poll.category}-${variant}-egg-${id}`,
								userId: user.firebase.id,
							});
							setShowPopup(true);
							setEggIsCollected(true);
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
