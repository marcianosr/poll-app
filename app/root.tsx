import type { MetaFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import Header from "./components/Header";
import { AuthProvider } from "./providers/AuthProvider";

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "New Remix App",
	viewport: "width=device-width,initial-scale=1",
});

export default function App() {
	return (
		<AuthProvider>
			<html lang="en">
				<head>
					<Meta />
					<Links />
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
