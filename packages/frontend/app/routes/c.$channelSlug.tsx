import { ThemeProvider } from "@marcianosrs/ui";
import { getChannelBySlug } from "./api.server";
import type { ChannelDTO } from "@marcianosrs/engine";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";

type LoaderData = {
	channel: ChannelDTO | null;
	userId: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const { decodedClaims } = await throwIfNotAuthorized(request);

	const slug = params.channelSlug;
	if (slug === undefined) {
		return json({ channel: null, userId: decodedClaims.uid });
	}

	const channel = await getChannelBySlug(slug);
	return json({ channel, userId: decodedClaims.uid });
};

export default function Channel() {
	const { channel, userId } = useLoaderData<LoaderData>();
	const { channelSlug } = useParams();
	if (!channel) {
		return (
			<div>
				<p>Channel "{channelSlug}" not found</p>
				<NavLink to="/admin/channels/new">Create channel</NavLink>
			</div>
		);
	}

	return (
		<ThemeProvider
			theme={channel.theme.type}
			themeSettings={channel.theme.data}
		>
			<header>
				<h1>Channel: {channel.name}</h1>
				<menu>
					<li>
						<NavLink to={`/c/${channel.slug}/`}>Poll</NavLink>
					</li>
					<li>
						<NavLink to={`/c/${channel.slug}/rankings/0`}>
							Rankings
						</NavLink>
					</li>
					<li>
						<NavLink to={`/c/${channel.slug}/manage/add-content`}>
							Add content
						</NavLink>
					</li>
				</menu>
			</header>
			<Outlet context={{ channel, userId }} />
			<footer>
				<NavLink to={"/polls/new"}>Suggest a poll</NavLink>
			</footer>
		</ThemeProvider>
	);
}
