import type { ChannelDTO } from "@marcianosrs/engine";
import { Button } from "@marcianosrs/ui";
import { useOutletContext } from "@remix-run/react";

export default function Channel() {
	const { channel } = useOutletContext<{ channel: ChannelDTO }>();

	console.log(channel);
	return (
		<main>
			<h2>Polls for this channel</h2>
			<p>Under Construction</p>
			<p>Playlist frequency: {channel.frequency.description}</p>
			<Button>Hello</Button>
		</main>
	);
}
