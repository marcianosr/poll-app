import React, { createContext, PropsWithChildren, useEffect } from "react";
import { getPollAppUser, PollAppUser } from "~/logic/auth";
import { getAdminUser } from "~/utils/user";

type AuthContextState = {
	user: PollAppUser | null;
	setUser: (user: PollAppUser) => void;
	isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextState>({
	user: null,
	setUser: () => {},
	isAdmin: false,
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = React.useState<PollAppUser | null>(null);
	const [isAdmin, setAdmin] = React.useState(false);

	const setPollUser = (pollAppUser: PollAppUser | null) => {
		setUser(pollAppUser);

		getAdminUser(pollAppUser?.email || "").then((result) =>
			setAdmin(result)
		);
	};

	useEffect(() => {
		getPollAppUser().then((result) => result && setPollUser(result));
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser: setPollUser,
				isAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextState => React.useContext(AuthContext);
