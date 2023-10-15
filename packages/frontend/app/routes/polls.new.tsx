import { questionTypeStore } from "@marcianosrs/engine";
import { SchemaForm, pluginField, schemaToZod } from "@marcianosrs/form";
import type { TypedForm } from "@marcianosrs/form-schema";
import { zodToDescription } from "@marcianosrs/utils";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import React from "react";
import { formAction } from "../form-action.server";
import { throwIfNotAuthorized } from "../util/isAuthorized";

// export const action = async ({ request }: ActionArgs) => {
//     await throwIfNotAuthorized(request);

//     const { decodedClaims } = await isSessionValid(request);
//     const session = await getSession(request.headers.get("cookie"));

//     return redirect("/polls");
// };

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

const mutation = makeDomainFunction(zodSchema)(async (values) => {
    console.log(values); /* or anything else, like saveMyValues(values) */
    return values;
});

export const action: ActionFunction = async ({ request }) => {
    return formAction({
        request,
        schema: zodSchema,
        mutation,
        // successPath: "/success" /* path to redirect on success */,
    });
};

export default function NewPoll() {
    console.log(zodToDescription(zodSchema));

    return (
        <main>
            <Link to="/polls">Back to list of polls</Link>
            <h1>Create new poll</h1>
            <SchemaForm schema={schema} formId="questionType" />
        </main>
    );
}
