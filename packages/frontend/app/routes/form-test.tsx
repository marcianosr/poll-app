import type { ActionFunction } from "@remix-run/node";
import { formAction } from "../form-action.server"; /* path to your custom formAction */
import { makeDomainFunction } from "domain-functions";
import { schemaToZod, SchemaForm } from "@marcianosrs/form";
import { ThemeProvider } from "@marcianosrs/ui";
import {
	type TypedForm,
	type FormDataObject,
	pluginField,
} from "@marcianosrs/form-schema";
import { useActionData } from "@remix-run/react";
import { themeStore } from "@marcianosrs/engine";

const memberFormDefinition = [
	{
		name: "firstName",
		fieldType: "text",
		valueType: "string",
		displayName: "First name",
		optional: false,
		defaultValue: "",
	},
	{
		name: "lastName",
		fieldType: "text",
		valueType: "string",
		displayName: "Last name",
		optional: false,
		defaultValue: "",
	},
] as const satisfies TypedForm;

const teamFormDefinition = [
	{
		name: "teamKey",
		fieldType: "text",
		valueType: "string",
		displayName: "Team key",
		optional: false,
		defaultValue: "",
	},
	{
		name: "teamName",
		fieldType: "text",
		valueType: "string",
		displayName: "Team name",
		optional: false,
		defaultValue: "",
	},
	{
		name: "teamColor",
		fieldType: "color",
		valueType: "string",
		displayName: "Team color",
		optional: false,
		defaultValue: "#0000ff",
	},
	{
		name: "members",
		fieldType: "objectList",
		valueType: "objects",
		displayName: "Members",
		optional: false,
		objectSchema: memberFormDefinition,
		minimalAmount: 1,
	},
] as const satisfies TypedForm;

const formDefinition = [
	pluginField("theme", "Theme", themeStore, "displayName", "editForm"),
	{
		name: "multiplier",
		displayName: "Multiplier",
		valueType: "number",
		fieldType: "number",
		optional: false,
		defaultValue: 1,
		min: 0.1,
		max: 5.0,
	},
	{
		name: "title",
		fieldType: "title",
		valueType: "none",
		displayName: "Team play setup",
		optional: false,
		defaultValue: undefined,
	},
	{
		name: "teams",
		fieldType: "objectList",
		valueType: "objects",
		displayName: "Teams",
		optional: false,
		objectSchema: teamFormDefinition,
		minimalAmount: 2,
	},
	{
		name: "difficulty-slider",
		fieldType: "range",
		valueType: "number",
		displayName: "Select difficulty:",
		optional: true,
		defaultValue: 1,
		min: 1,
		max: 10,
		step: 1,
		labels: [
			{
				title: "Very easy",
				value: 1,
			},
			{
				title: "Easy",
				value: 3,
			},
			{
				title: "Medium",
				value: 5,
			},
			{
				title: "Hard",
				value: 8,
			},
			{
				title: "Expert",
				value: 9,
			},
			{
				title: "Godlike",
				value: 10,
			},
		],
	},
	{
		name: "name",
		fieldType: "text",
		valueType: "string",
		displayName: "Scoreboard name",
		optional: false,
		defaultValue: "",
	},
] as const satisfies TypedForm;

const schema = schemaToZod(formDefinition);

const mutation = makeDomainFunction(schema)(async (values) => {
	console.log(values); /* or anything else, like saveMyValues(values) */
	return values;
});

export const action: ActionFunction = async ({ request }) =>
	formAction({
		request,
		schema,
		mutation,
		// successPath: "/success" /* path to redirect on success */,
	});

type FormDataStructure = FormDataObject<typeof formDefinition>;

export default function FormTest() {
	const data = useActionData<FormDataStructure>();

	const themeName = data?.theme.type ?? "html";
	const themeSettings = data?.theme.data ?? {};

	return (
		<main>
			<ThemeProvider theme={themeName} themeSettings={themeSettings}>
				<h1>Form testing area</h1>
				<SchemaForm schema={formDefinition} formId="pluginTest" />
			</ThemeProvider>
		</main>
	);
}
