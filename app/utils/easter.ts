import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getFirestore,
	setDoc,
	doc,
	arrayUnion,
	getDoc,
	collection,
	query,
	getDocs,
} from "firebase/firestore";
import { EggVariant } from "~/seasonal/Egg";
import { firebaseConfig } from "~/utils/config.client";
import { db } from "~/utils/firebase";

export const storeEggData = async (payload: EggPayload) => {
	const app =
		getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

	const db = getFirestore(app);
	console.log("store egs", payload);

	const snapshot = await setDoc(
		doc(db, "easter", payload.userId),
		{
			eggs: {
				[payload.variant]: arrayUnion(payload.eggId),
			},
			userId: payload.userId,
		},
		{
			merge: true,
		}
	);

	return snapshot;
};

export const getEggsData = async () => {
	const ref = collection(db, "easter");
	const getQuery = query(ref);
	const querySnapshot = await getDocs(getQuery);

	return querySnapshot.docs.map((item) => item.data());
};

type EggPayload = { eggId: string; variant: EggVariant; userId: string };

export const onClickEgg = async (payload: EggPayload) => {
	return await storeEggData({
		eggId: payload.eggId,
		variant: payload.variant,
		userId: payload.userId,
	});
};