import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import { Header, links as headerLinks } from "./components/Header";
import { AuthProvider } from "./providers/AuthProvider";
import styles from "~/styles/shared.css";
import { getPollById } from "./utils/polls";

export function links() {
	return [...headerLinks(), { rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Frontend poll app",
	viewport: "width=device-width,initial-scale=1",
});

export default function App() {
	return (
		<AuthProvider>
			<html lang="en">
				<head>
					<Meta />
					<Links />

					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin=""
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Montserrat:wght@700;900&display=swap"
						rel="stylesheet"
					/>
				</head>
				<body>
					<Header />
					<Outlet />
					<ScrollRestoration />
					<Scripts />
					<LiveReload />
				</body>
			</html>
		</AuthProvider>
	);
}
