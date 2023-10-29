import type { TypedForm, FormDataObject } from "@marcianosrs/form-schema";

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
		fieldType: "text" /* color ? */,
		valueType: "string",
		displayName: "Team color",
		optional: false,
		defaultValue: "blue",
	},
] as const satisfies TypedForm;

const formDefinition = [
	{
		name: "title",
		fieldType: "title",
		valueType: "none",
		displayName: "Team play setup",
		optional: false,
		defaultValue: undefined,
	},
	{
		name: "name",
		fieldType: "text",
		valueType: "string",
		displayName: "Scoreboard name",
		optional: false,
		defaultValue: "",
	},
	{
		name: "teams",
		fieldType: "objectList",
		valueType: "objects",
		displayName: "Scoreboard name",
		optional: false,
		objectSchema: teamFormDefinition,
		minimalAmount: 2,
	},
] as const satisfies TypedForm;

type TeamScoreDataModel = FormDataObject<typeof formDefinition>;
