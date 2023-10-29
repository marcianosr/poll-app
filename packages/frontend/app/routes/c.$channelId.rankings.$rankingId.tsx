import { rankingSystemStore, type ChannelDTO } from "@marcianosrs/engine";
import { NavLink, useOutletContext, useParams } from "@remix-run/react";

export default function Channel() {
	const { channel } = useOutletContext<{ channel: ChannelDTO }>();
	const { rankingId } = useParams();
	const index = parseInt(rankingId ?? 0, 10);
	const system = channel.rankingSystems[index];

	const rankingPlugin = rankingSystemStore.get(system.ranking.type);
	const rankingData = rankingPlugin.initializeSystemData();

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
					data={rankingData}
				/>
			</main>
		</div>
	);
}
