import type { ChannelDTO } from "@marcianosrs/engine";
import { NavLink, useOutletContext } from "@remix-run/react";

export default function Channel() {
	const { channel } = useOutletContext<{ channel: ChannelDTO }>();

	return (
		<div>
			{channel.rankingSystems.map((ranking, index) => (
				<p key={index}>
					<NavLink to={`/c/${channel.slug}/rankings/${index}`}>
						{ranking.ranking.type}
					</NavLink>
				</p>
			))}
		</div>
	);
}
