import { getChannelBySlug, getRankingSystemById } from "./api.server";
import { rankingSystemStore } from "@marcianosrs/engine";
import type { RankingSystemDTO, ChannelDTO } from "@marcianosrs/engine";
import { json, type LoaderFunction } from "@remix-run/node";
import {
	NavLink,
	useLoaderData,
	useOutletContext,
	useParams,
} from "@remix-run/react";
import { throwIfNotAuthorized } from "~/util/isAuthorized";

type LoaderData = {
	rankingData: RankingSystemDTO | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	await throwIfNotAuthorized(request);
	const { rankingId, channelSlug } = params;
	const channel = channelSlug ? await getChannelBySlug(channelSlug) : null;
	const index = parseInt(rankingId ?? "0", 10);

	const system = channel?.rankingSystems[index];
	const rankingData =
		system && system.rankingSystemId
			? await getRankingSystemById(system.rankingSystemId)
			: null;

	return json({ rankingData });
};

export default function Ranking() {
	const { channel } = useOutletContext<{ channel: ChannelDTO }>();
	const { rankingData } = useLoaderData<LoaderData>();
	const { rankingId } = useParams();
	const index = parseInt(rankingId ?? "0", 10);
	const system = channel.rankingSystems[index];

	const rankingPlugin = rankingSystemStore.get(system.ranking.type);
	const data = rankingData?.content ?? rankingPlugin.initializeSystemData();

	return (
		<div>
			{channel.rankingSystems.map((ranking, index) => (
				<p key={index}>
					<NavLink to={`/c/${channel.slug}/rankings/${index}`}>
						{ranking.ranking.type}
					</NavLink>
				</p>
			))}

			<main>
				<rankingPlugin.RankingPage
					settings={system.ranking.data}
					data={data}
				/>
			</main>
		</div>
	);
}
