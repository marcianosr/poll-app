import { ThemeProvider } from "@marcianosrs/ui";
import { getChannelBySlug } from "./api.server";
import type { ChannelDTO } from "@marcianosrs/engine";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";

type LoaderData = {
	channel: ChannelDTO;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);

	const id = params.id;
	if (!id) {
		throw new Error("No channel slug provided");
	}
	const channel = await getChannelBySlug(id);

	return json({ channel });
};

export default function Channel() {
	const { channel } = useLoaderData<LoaderData>();

	return (
		<ThemeProvider
			theme={channel.theme.type}
			themeSettings={channel.theme.data}
		>
			<nav>
				<p>Hello</p>
			</nav>
			<Outlet context={channel} />
		</ThemeProvider>
	);
}
