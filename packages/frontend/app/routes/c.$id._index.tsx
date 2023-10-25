import type { ChannelDTO } from "@marcianosrs/engine";
import { Button } from "@marcianosrs/ui";
import { useOutletContext } from "@remix-run/react";

export default function Channel() {
	const channel = useOutletContext<ChannelDTO>();
	return (
		<main>
			<h1>Channel: {channel.name}</h1>

			<h2>Polls for this channel</h2>
			<p>Under Construction</p>
			<Button>Hello</Button>
		</main>
	);
}
