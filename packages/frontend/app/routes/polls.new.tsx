import { questionTypeStore } from "@marcianosrs/engine";
import { SchemaForm, getFormId, schemaToZod } from "@marcianosrs/form";
import type { FormDataObject, TypedForm } from "@marcianosrs/form-schema";
import { zodToDescription } from "@marcianosrs/utils";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/form-action.server";
import { throwIfNotAuthorized } from "~/util/isAuthorized";

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

const questionTypes = [
    {
        fieldType: "select",
        valueType: "list",
        options: questionTypeStore.getIdentifiers().map((pluginId) => {
            const plugin = questionTypeStore.get(pluginId);
            return { display: plugin.displayName, value: pluginId };
        }),
        optional: false,
        name: "questionType",
        displayName: "Question type",
        defaultValue: questionTypeStore.getIdentifiers()[0],
    },
] as const satisfies TypedForm;

const schema = schemaToZod(questionTypes);
console.log(zodToDescription(schema));

const createQuestionSchema = (questionType: string) => {
    const plugin = questionTypeStore.get(questionType);

    const questionData = [
        {
            fieldType: "text", // This should be a new field type
            valueType: "string",
            optional: false,
            name: "questionType",
            displayName: "QuestionType",
            defaultValue: questionType,
        },
        {
            fieldType: "object",
            valueType: "object",
            optional: false,
            displayName: "Plugin Data",
            name: "pluginData",
            objectSchema: plugin.editForm,
        },
        {
            fieldType: "text", // This should be a new field type
            valueType: "string",
            optional: true,
            name: "tags",
            displayName: "Tags",
            defaultValue: "",
        },
    ] as const satisfies TypedForm;

    return questionData;
};

const mutation = makeDomainFunction(schema)(async (values) => {
    console.log(values); /* or anything else, like saveMyValues(values) */
    return values;
});

export const action: ActionFunction = async ({ request }) => {
    const formId = await getFormId(request);
    if (formId === "questionType") {
        return formAction({
            request,
            schema,
            mutation,
            // successPath: "/success" /* path to redirect on success */,
        });
    }

    // if (formId == "questionData") {

    //     const questionSchema = createQuestionSchema()

    //     const questionMutation = makeDomainFunction(questionSchema)(
    //         async (values) => {
    //             console.log(
    //                 values
    //             ); /* or anything else, like saveMyValues(values) */
    //             return values;
    //         }
    //     );
    //     return formAction({
    //         request,
    //         questionSchema,
    //         mutation: questionMutation,
    //         // successPath: "/success" /* path to redirect on success */,
    //     });
    // }
};

export default function NewPoll() {
    const data = useActionData<FormDataObject<typeof questionTypes>>();

    const questionType =
        data?.questionType ?? questionTypeStore.getIdentifiers()[0];

    const questionData = createQuestionSchema(questionType);

    const schema = schemaToZod(questionData);
    console.log(zodToDescription(schema));
    return (
        <main>
            <Link to="/polls">Back to list of polls</Link>
            <h1>Create new poll</h1>
            <SchemaForm schema={questionTypes} formId="questionType" />
            <SchemaForm schema={questionData} formId="questionData" />
        </main>
    );
}
