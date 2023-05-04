import { initServerFirebase } from "@marcianosrs/server-auth";

const { auth } = initServerFirebase();

export const getUserRole = async (userId: string) => {
	const claims = await auth.getUser(userId).then((user) => user.customClaims);
	return { role: claims?.role || "user" };
};

export const setUserRole = async (userId: string) => {
	return await auth.setCustomUserClaims(userId, { role: "admin" });
};

export const isAdmin = async (userId: string) => {
	const { role } = await getUserRole(userId);

	return role === "admin";
};
