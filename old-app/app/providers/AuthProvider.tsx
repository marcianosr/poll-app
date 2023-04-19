import React, { createContext, PropsWithChildren, useEffect } from "react";
import { getPollAppUser, PollAppUser } from "~/logic/auth";
import { getUserByRole } from "~/utils/user";

type AuthContextState = {
	user: PollAppUser | null;
	setUser: (user: PollAppUser) => void;
	isAdmin: boolean;
	isModerator: boolean;
};

export const AuthContext = createContext<AuthContextState>({
	user: null,
	setUser: () => {},
	isAdmin: false,
	isModerator: false,
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = React.useState<PollAppUser | null>(null);
	const [isAdmin, setAdmin] = React.useState(false);
	const [isModerator, setModerator] = React.useState(false);

	const setPollUser = (pollAppUser: PollAppUser | null) => {
		setUser(pollAppUser);

		getUserByRole(pollAppUser?.email || "", "admin").then((result) =>
			setAdmin(result)
		);

		getUserByRole(pollAppUser?.email || "", "moderator").then((result) =>
			setModerator(result)
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
				isModerator,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextState => React.useContext(AuthContext);
