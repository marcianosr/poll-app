import type { CreatePollDTO } from "@marcianosrs/engine";
import { questionTypeStore } from "@marcianosrs/engine";
import { SchemaForm, pluginField, schemaToZod } from "@marcianosrs/form";
import type { TypedForm } from "@marcianosrs/form-schema";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "../form-action.server";
import { throwIfNotAuthorized } from "../util/isAuthorized";
import { createPoll } from "./api.server";

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

const mutation = (userId: string) =>
	makeDomainFunction(zodSchema)(async (values) => {
		const newPoll: CreatePollDTO = {
			...values,
			createdBy: userId,
		};
		const createdPoll = await createPoll(newPoll);
		return createdPoll;
	});

export const action: ActionFunction = async ({ request }) => {
	const { decodedClaims } = await throwIfNotAuthorized(request);
	return formAction({
		request,
		schema: zodSchema,
		mutation: mutation(decodedClaims.uid),
		successPath: "/polls/",
	});
};

export default function NewPoll() {
	return (
		<main>
			<NavLink to="/polls">Back to list of polls</NavLink>
			<h1>Create new poll</h1>
			<SchemaForm schema={schema} formId="questionType" />
		</main>
	);
}
