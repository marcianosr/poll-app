import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node"; // or cloudflare/deno
import { registerQuestionPlugins } from "~/plugins/questionTypes";
registerQuestionPlugins();

export const links: LinksFunction = () =>
	cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [];

export default function App() {
	return (
		<html
			lang="en"
			style={{
				background: "#111",
				color: "#dcb",
			}}
		>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
