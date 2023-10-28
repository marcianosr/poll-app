import { ThemeProvider } from "@marcianosrs/ui";
import { getChannelBySlug } from "./api.server";
import type { ChannelDTO } from "@marcianosrs/engine";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";

type LoaderData = {
	channel: ChannelDTO;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);

	const id = params.id;
	try {
		const channel = await getChannelBySlug(id);

		return json({ channel });
	} catch (e) {
		return json({});
	}
};

export default function Channel() {
	const { channel } = useLoaderData<LoaderData>();
	const { id } = useParams();
	if (!channel) {
		return (
			<div>
				<p>Channel "{id}" not found</p>
				<NavLink to="/admin/channels/new">Create channel</NavLink>
			</div>
		);
	}

	return (
		<ThemeProvider
			theme={channel.theme.type}
			themeSettings={channel.theme.data}
		>
			<nav>
				<p>Hello</p>
			</nav>
			<header>
				<h1>Channel: {channel.name}</h1>
				<menu>
					<li>
						<NavLink to={`/c/${channel.slug}/`}>Poll</NavLink>
					</li>
					<li>
						<NavLink to={`/c/${channel.slug}/rankings/`}>
							Rankings
						</NavLink>
					</li>
				</menu>
			</header>
			<Outlet context={{ channel }} />
			<footer>
				<NavLink to={"/polls/new"}>Suggest a poll</NavLink>
			</footer>
		</ThemeProvider>
	);
}
