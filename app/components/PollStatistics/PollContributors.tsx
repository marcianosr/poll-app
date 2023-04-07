import { Title } from "~/ui/Title";
import { Text } from "~/ui/Text";
import { PollData } from "~/utils/polls";

type Props = { polls: PollData[] };

const pollCounts = (polls: PollData[]) =>
	polls
		.filter((poll) => poll.sentInByUser)
		.reduce<Record<string, number>>((acc, poll) => {
			const name = poll.sentInByUser?.displayName || "";

			if (acc[name]) {
				acc[name]++;
			} else {
				acc[name] = 1;
			}
			return acc;
		}, {});

export const PollContributors = ({ polls }: Props) => (
	<section className="poll-contributors">
		<div>
			<Title size="sm" variant="primary" tag="h3">
				Poll contributors
			</Title>
			<ul>
				{Object.entries(pollCounts(polls))
					.sort((a, b) => b[1] - a[1])
					.map(([name, amount], idx) => {
						const isRainbow = idx === 0;
						return (
							<li>
								<Text
									size="xs"
									variant={isRainbow ? "rainbow" : "primary"}
								>
									{name} ({amount})
								</Text>
							</li>
						);
					})}
			</ul>
		</div>
		<hr />
		<div>
			<Title size="sm" variant="primary" tag="h3">
				Special thanks to
			</Title>
			<ul>
				<li>
					<Text size="xs" variant="rainbow">
						Matthijs Groen
					</Text>
				</li>
				<li>
					<Text size="xs" variant="rainbow">
						Jean-Paul Weijers
					</Text>
				</li>
			</ul>
		</div>
	</section>
);
