import { Fragment, useEffect, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useAuth } from "~/providers/AuthProvider";
import styles from "~/styles/new-channel.css";
import { InputField } from "~/ui/InputField";
import { Text } from "~/ui/Text";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../polls/commonStyleLinks";
import { Fieldset } from "~/ui/Fieldset";
import { getAllPolls, PollData } from "~/utils/polls";
import { useLoaderData } from "@remix-run/react";
import { getAllUniqueCategories } from "~/utils/categories";
import { Button } from "~/ui/Button";
import classNames from "classnames";

export function links() {
	return [...commonStyleLinks(), { rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();

	return {};
};

export const loader: LoaderFunction = async ({ params, ...rest }) => {
	const polls = await getAllPolls();
	return { polls };
};

type Channel = {
	name: string;
	selectedPolls: PollData[];
};

export default function NewChannel() {
	const { isAdmin } = useAuth();
	const { polls } = useLoaderData();

	const displayedCategories = getAllUniqueCategories(polls);
	const [activeCategory, setActiveCategory] = useState("javascript");
	const [channel, setChannel] = useState<Channel>({
		name: "",
		selectedPolls: [],
	});

	if (!isAdmin) {
		return <h1>404 Not Found</h1>;
	}
	const isChannelValid =
		channel.name.length > 0 && channel.selectedPolls.length > 0;

	return (
		<section className="new-channel-page">
			<Fieldset title="Create a new channel">
				<label htmlFor="channel-name">
					<Title size="sm" variant="primary" tag="h3">
						Name
					</Title>
					<Text tag="small" variant="primary" size="xs">
						Channel names can't be changed after you submit.
					</Text>
				</label>
				<InputField
					name="channel-name"
					placeholder="e.g frontend, backend, christmas, JavaScript-only etc."
					type="text"
					id="channel-name"
					isValid={true}
					value={channel.name}
					onChange={(e) => {
						setChannel({ ...channel, name: e.target.value });
					}}
				/>
				<Title size="sm" variant="primary" tag="span">
					Categories
				</Title>
				<ul className="new-channel-poll-category-list">
					{displayedCategories.map((category) => (
						<li
							key={category}
							className={`new-channel-poll-category-list-item ${category}`}
						>
							<Button
								variant="secondary"
								state={
									activeCategory === category
										? "active"
										: undefined
								}
								onClick={() => setActiveCategory(category)}
							>
								{category}
							</Button>
						</li>
					))}
				</ul>
				<section className="new-channel-panel">
					<div>
						<Title size="sm" variant="primary" tag="span">
							Select a poll to add to your queue
						</Title>
						<ul className="new-channel-poll-list">
							{polls
								.filter(
									(poll: PollData) =>
										poll.category === activeCategory
								)
								.map((poll: PollData, idx: number) => {
									const isPollSelected =
										channel.selectedPolls.includes(poll);

									return (
										<li
											className={classNames(
												"new-channel-poll-list-item",
												{
													"new-channel-queue-poll-selected":
														isPollSelected,
												}
											)}
											key={idx + 1}
										>
											<button
												className="new-channel-queue-poll-button"
												type="button"
												onClick={() => {
													if (isPollSelected) return;
													return setChannel({
														...channel,
														selectedPolls: [
															...channel.selectedPolls,
															poll,
														],
													});
												}}
											>
												<div className="new-channel-poll-queue-content">
													<span className="new-channel-queue-poll-idx">
														#{idx + 1}
													</span>
													<span className="new-channel-poll-list-question">
														{poll.question}
													</span>
												</div>
											</button>
										</li>
									);
								})}
						</ul>
					</div>
					<div>
						<Title size="sm" variant="primary" tag="span">
							Your queue ({channel.selectedPolls.length})
						</Title>
						<ul
							className={classNames(
								"new-channel-poll-list",
								"new-channel-poll-queue",
								{
									"new-channel-poll-queue-empty":
										channel.selectedPolls.length === 0,
								}
							)}
						>
							{channel.selectedPolls.length === 0 && (
								<Title size="sm" variant="primary" tag="span">
									Queue is empty
								</Title>
							)}
							{channel.selectedPolls.map((poll, idx) => (
								<li
									className="new-channel-poll-list-item"
									key={idx + 1}
								>
									<ul className="new-channel-poll-queue-content">
										<li className="new-channel-queue-poll-idx">
											#{idx + 1}
										</li>
										<li
											className={`new-channel-poll-list-item-category ${poll.category}`}
										>
											{poll.category}
										</li>
										{poll.sentInByUser && (
											<li className="new-channel-secondary-text">
												Sent in by:{" "}
												{poll.sentInByUser?.displayName}
											</li>
										)}
									</ul>
									<span>{poll.question}</span>
								</li>
							))}
						</ul>
					</div>
				</section>
				<Button
					variant="submit"
					state={!isChannelValid ? "disabled" : undefined}
				>
					Create channel
				</Button>
				<Text tag="small" variant="primary" size="xs">
					*Currently this channel is public and anyone can view and
					join. It is not possible yet to make a channel private.
				</Text>
			</Fieldset>
		</section>
	);
}
