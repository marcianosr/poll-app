import type { CreateChannelDTO } from "@marcianosrs/engine";
import { SchemaForm, pluginField, schemaToZod } from "@marcianosrs/form";
import type { TypedForm } from "@marcianosrs/form-schema";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "../form-action.server";
import { throwIfNotAuthorized } from "../util/isAuthorized";
import { createChannel, createPoll } from "./api.server";
import { themeStore } from "@marcianosrs/ui";

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);
	return {};
};

const schema = [
	{
		name: "name",
		valueType: "string",
		fieldType: "text",
		defaultValue: "",
		displayName: "name",
		optional: false,
	},
	// 	{name: "slugDescription",
	// 	fieldType: "description"
	// },
	pluginField("theme", "Theme", themeStore, "displayName", "editForm"),
] as const satisfies TypedForm;

const zodSchema = schemaToZod(schema);

const mutation = (userId: string) =>
	makeDomainFunction(zodSchema)(async (values) => {
		const newChannel: CreateChannelDTO = {
			...values,
			createdBy: userId,
		};
		const createdChannel = await createChannel(newChannel);
		return createdChannel;
	});

export const action: ActionFunction = async ({ request }) => {
	const { decodedClaims } = await throwIfNotAuthorized(request);
	return formAction({
		request,
		schema: zodSchema,
		mutation: mutation(decodedClaims.uid),
		successPath: (data) => `/c/${data.slug}`,
	});
};

export default function NewChannel() {
	return (
		<main>
			<Link to="/polls">Back to Channel list (homepage?)</Link>
			<h1>Create new channel</h1>
			<SchemaForm schema={schema} formId="channel" />
		</main>
	);
}
