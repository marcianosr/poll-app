import { Fragment, useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useAuth } from "~/providers/AuthProvider";
import styles from "~/styles/new-channel.css";
import { InputField } from "~/ui/InputField";
import { Text } from "~/ui/Text";
import { Title } from "~/ui/Title";
import { links as commonStyleLinks } from "../polls/commonStyleLinks";
import { Fieldset } from "~/ui/Fieldset";
import { getAllPolls, getAllPollsWithIds, PollData } from "~/utils/polls";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getAllUniqueCategories } from "~/utils/categories";
import { Button } from "~/ui/Button";
import classNames from "classnames";
import { ReactSortable } from "react-sortablejs";
import { Channel, createChannel, getChannelByName } from "~/utils/channels";

export function links() {
	return [...commonStyleLinks(), { rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const channelName = formData.get("channel-name") as string;
	const pollQueue = formData.get("pollQueue") as string;
	const pollIds = JSON.parse(pollQueue).map(
		(poll: PollData) => poll.documentId
	);
	const uid = formData.get("uid") as string;

	const channelData: Channel = {
		name: channelName,
		pollQueue: pollIds,
		moderatorsIds: [uid],
		participantsIds: [uid],
	};

	if (channelData.name.length === 0 || pollQueue.length === 0) {
		return { error: true };
	}

	const existingChannel = await getChannelByName(channelName);

	if (existingChannel) {
		return {
			error: true,
			message: {
				name: "Channel name already exists",
			},
		};
	}

	const newChannel: { id: string } = await createChannel(channelData);

	return redirect(`/channels/${newChannel.id}`);
};

export const loader: LoaderFunction = async ({ params, request }) => {
	const polls = await getAllPollsWithIds();
	return { polls };
};

type ChannelForm = Pick<Channel, "name" | "pollQueue">;

export default function NewChannel() {
	const { user, isAdmin, isModerator } = useAuth();
	const { polls } = useLoaderData();
	const actionData = useActionData();
	const displayedCategories = getAllUniqueCategories(polls);
	const [activeCategory, setActiveCategory] = useState("javascript");
	const [channel, setChannel] = useState<ChannelForm>({
		name: "",
		pollQueue: [],
	});

	if (!isModerator && !isAdmin) {
		return <h1>404 Not Found</h1>;
	}

	const isChannelValid =
		channel.name.length > 0 && channel.pollQueue.length > 0;

	return (
		user && (
			<section className="new-channel-page">
				{actionData?.error && <h1>An unexpected error occured.</h1>}
				<Form method="post">
					<Fieldset title="Create a new channel">
						<label htmlFor="channel-name">
							{actionData?.message.name && (
								<Text size="sm" variant="primary" tag="span">
									{actionData.message}
								</Text>
							)}
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
							value={channel.name}
							onChange={(e) =>
								setChannel({ ...channel, name: e.target.value })
							}
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
										onClick={() =>
											setActiveCategory(category)
										}
									>
										{category} (
										{
											polls.filter(
												(poll: PollData) =>
													poll.category === category
											).length
										}
										)
									</Button>
								</li>
							))}
						</ul>
						<section className="new-channel-panel">
							<div>
								<Title size="sm" variant="primary" tag="span">
									Select a poll to add to your queue
								</Title>
								<Text size="xs" variant="primary" tag="p">
									Click a poll to add it to your queue
								</Text>
								<ul className="new-channel-poll-list new-channel-scroll-container">
									{polls
										.filter(
											(poll: PollData) =>
												poll.category === activeCategory
										)
										.map((poll: PollData, idx: number) => {
											const isPollSelected =
												channel.pollQueue.includes(
													poll
												);

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
															if (isPollSelected)
																return;
															return setChannel({
																...channel,
																pollQueue: [
																	...channel.pollQueue,
																	poll,
																],
															});
														}}
													>
														<QueueItemContent
															pollNumber={
																poll.pollNumber ||
																0
															}
															question={
																poll.question
															}
														/>
													</button>
												</li>
											);
										})}
								</ul>
							</div>
							<div>
								<Title size="sm" variant="primary" tag="span">
									Your queue ({channel.pollQueue.length})
								</Title>
								<Text size="xs" variant="primary" tag="p">
									Drag and drop to sort them into the order
									you want
								</Text>
								<ul
									className={classNames(
										"new-channel-poll-list",
										"new-channel-poll-queue",
										{
											"new-channel-poll-queue-empty":
												channel.pollQueue.length === 0,
										}
									)}
								>
									{channel.pollQueue.length === 0 && (
										<Title
											size="sm"
											variant="primary"
											tag="span"
										>
											The queue is empty
										</Title>
									)}
									<ReactSortable
										animation={200}
										delay={1}
										swap
										className="list-sortable"
										list={channel.pollQueue}
										setList={(newList) =>
											setChannel({
												...channel,
												pollQueue: newList,
											})
										}
									>
										{channel.pollQueue.map((poll, idx) => (
											<li
												className="new-channel-poll-list-item"
												key={poll.pollNumber}
											>
												<QueueItemContent
													pollNumber={
														poll.pollNumber || 0
													}
													category={poll.category}
													sentInByUser={
														poll.sentInByUser
													}
													question={poll.question}
													withControls={true}
													onRemove={() =>
														setChannel({
															...channel,
															pollQueue:
																channel.pollQueue.filter(
																	(
																		p: PollData
																	) =>
																		p.id !==
																		poll.id
																),
														})
													}
												/>
											</li>
										))}
									</ReactSortable>
								</ul>
							</div>
						</section>

						<input
							type="hidden"
							name="pollQueue"
							value={JSON.stringify(channel.pollQueue)}
						/>
						<input
							type="hidden"
							name="uid"
							defaultValue={user.firebase.id}
						/>
						<Button
							variant="submit"
							state={!isChannelValid ? "disabled" : undefined}
						>
							Create channel
						</Button>
						<Text tag="small" variant="primary" size="xs">
							*Currently this channel is public and anyone can
							view and join. It is not possible yet to make a
							channel private.
						</Text>
					</Fieldset>
				</Form>
			</section>
		)
	);
}

const QueueItemContent = ({
	pollNumber,
	category,
	sentInByUser,
	question,
	withControls,
	onRemove,
}: {
	pollNumber: number;
	category?: string;
	sentInByUser?: any;
	question: string;
	withControls?: boolean;
	onRemove?: () => void;
}) => (
	<>
		<ul className="new-channel-poll-queue-content">
			<li className="new-channel-queue-poll-idx">#{pollNumber}</li>
			{category && (
				<li
					className={`new-channel-poll-list-item-category ${category}`}
				>
					{category}
				</li>
			)}
			{sentInByUser && (
				<li className="new-channel-secondary-text">
					Sent in by: {sentInByUser?.displayName}
				</li>
			)}
		</ul>
		<span>{question}</span>
		{withControls && <button onClick={onRemove}>Remove</button>}
	</>
);
