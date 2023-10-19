import type { CreatePollDTO } from "@marcianosrs/engine";
import { questionTypeStore } from "@marcianosrs/engine";
import { SchemaForm, pluginField, schemaToZod } from "@marcianosrs/form";
import type { TypedForm } from "@marcianosrs/form-schema";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "../form-action.server";
import { throwIfNotAuthorized } from "../util/isAuthorized";
import { API_ENDPOINT } from "~/util";
import { getSession } from "~/util/session.server";

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);
	return {};
};

const schema = [
	pluginField(
		"question",
		"Question",
		questionTypeStore,
		"displayName",
		"editForm"
	),
] as const satisfies TypedForm;

const zodSchema = schemaToZod(schema);

const mutation = (userId: string, accessToken: string) =>
	makeDomainFunction(zodSchema)(async (values) => {
		const newPoll: CreatePollDTO = {
			...values,
			createdBy: userId,
			createdAt: new Date().getTime(),
		};

		await fetch(`${API_ENDPOINT}/polls/new`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(newPoll),
		});

		return values;
	});

export const action: ActionFunction = async ({ request }) => {
	const { decodedClaims } = await throwIfNotAuthorized(request);
	const session = await getSession(request.headers.get("cookie"));

	return formAction({
		request,
		schema: zodSchema,
		mutation: mutation(decodedClaims.uid, session.get("accessToken")),
		successPath: "/polls/",
	});
};

export default function NewPoll() {
	return (
		<main>
			<Link to="/polls">Back to list of polls</Link>
			<h1>Create new poll</h1>
			<SchemaForm schema={schema} formId="questionType" />
		</main>
	);
}
