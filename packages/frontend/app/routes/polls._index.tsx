import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession } from "~/util/session.server";
import { questionTypeStore, type Poll } from "@marcianosrs/engine";

type LoaderData = {
    polls: Poll[]; // This is a mismatch with the type in firebase at the moment
};

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("cookie"));

    await throwIfNotAuthorized(request);

    const response = await fetch(`${API_ENDPOINT}/polls`, {
        headers: {
            Authorization: `Bearer ${session.get("accessToken")}`,
        },
    });

    const data = await response.json();
    console.log(data);

    return json({ polls: data });
};

export default function Index() {
    const { polls } = useLoaderData<LoaderData>();
    console.log(polls, "POLLS");

    return (
        <main>
            <h1>Polls</h1>
            <Link to={"/polls/new"}>Create new poll</Link>

            <ul>
                {polls.map((poll) => {
                    const pluginType = poll.question.type;
                    const plugin = questionTypeStore.get(pluginType);
                    const name = plugin.getContentTitle(poll.question.data);

                    return (
                        <li key={poll.id}>
                            # {name}{" "}
                            <Link to={`/polls/${poll.id}`}>Go to poll</Link>{" "}
                            <Link to={`/polls/${poll.id}/edit`}>Edit</Link>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
