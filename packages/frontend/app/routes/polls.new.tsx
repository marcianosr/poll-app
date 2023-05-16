import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
	return {};
};

export default function NewPoll() {
	return (
		<main>
			<h1>Create new poll</h1>
		</main>
	);
}
