import { useEffect } from "react";
import { logout } from "~/logic/auth";

export default function Signout() {
	useEffect(() => {
		logout();
	}, []);
	return <h1>sign out</h1>;
}
