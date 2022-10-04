import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import PollStatistics from "~/components/PollStatistics";
import { useAuth } from "~/providers/AuthProvider";
import { createDevData, createKabisaPolls } from "~/utils/dev";
import {
	getAllPolls,
	getDocumentPollIds,
	PollData,
	PollStatus,
} from "~/utils/polls";
import { getAdminUser } from "~/utils/user";
import { transformToCodeTags } from "./$id";

export const loader: LoaderFunction = async ({ params }) => {
	// const isAdmin =
	// 	(await (await getAdminUser()).map((user) => user.role)[0]) === "admin";

	// if (!isAdmin) {
	// 	return redirect("/");
	// }
	const data = await getAllPolls();

	const ids = await getDocumentPollIds();

	// ! Enable when you want local DB population
	// await createDevData();
	// await createKabisaPolls();

	return { polls: data, docId: ids };
};

export default function AllPolls() {
	const { polls, docId } = useLoaderData();
	const { isAdmin } = useAuth();
	const [renderedPolls, setRenderedPolls] = useState(polls);

	const filterPollsByStatus = (category?: PollStatus) => {
		const filteredPolls = category
			? polls.filter((poll: PollData) => poll.status === category)
			: polls;
		setRenderedPolls(filteredPolls);
	};

	return (
		<section>
			{isAdmin ? (
				<>
					<h1>All polls</h1>
					<PollStatistics polls={polls} />

					<button type="button" onClick={() => filterPollsByStatus()}>
						All
					</button>
					<button
						type="button"
						onClick={() => filterPollsByStatus("new")}
					>
						New {}
					</button>
					<button
						type="button"
						onClick={() => filterPollsByStatus("needs-revision")}
					>
						Need revision
					</button>

					<Link to="/polls/new">Create new poll</Link>
					<ul>
						{renderedPolls.map((poll: PollData, idx: number) => (
							<li key={poll.id}>
								<p>
									#{poll.pollNumber} -{" "}
									{transformToCodeTags(poll.question, idx)}
								</p>
								{isAdmin && (
									<span>
										<span>{poll.status}</span>
										<Link to={`/polls/${docId[idx]}/edit`}>
											Edit
										</Link>
									</span>
								)}
								<Link to={`/polls/${docId[idx]}`}>
									Go to poll
								</Link>
							</li>
						))}
					</ul>
				</>
			) : (
				<>
					<h1>Your polls answered (coming soon 🚧)</h1>
				</>
			)}
		</section>
	);
}
