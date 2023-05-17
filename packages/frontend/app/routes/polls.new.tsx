import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { API_ENDPOINT } from "~/util";
import { throwIfNotAuthorized } from "~/util/isAuthorized";
import { getSession, isSessionValid } from "~/util/session.server";
import type { PollType, PollOption, CreatePoll } from "@marcianosrs/engine";
import { POLL_TAGS, POLL_TYPES } from "@marcianosrs/engine";

export const action = async ({ request }: ActionArgs) => {
	await throwIfNotAuthorized(request);

	const { decodedClaims } = await isSessionValid(request);
	const session = await getSession(request.headers.get("cookie"));

	let formData = await request.formData();
	const question = formData.get("question") as string;
	const type = formData.get("type") as PollType;
	const tags = formData.getAll("tags") as (typeof POLL_TAGS)[number][];
	const options = JSON.parse(
		formData.get("options") as string
	) as PollOption[];
	const visualCodeExample = formData.get("visualCodeExample") as string;
	const codeBlockExample = formData.get("codeBlockExample") as string;

	const getAmountOfPolls = async () => {
		const response = await fetch(`${API_ENDPOINT}/polls/count`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.json();
	};

	const poll: CreatePoll = {
		id: uuidv4(),
		question,
		type,
		tags,
		options,
		codeBlockExample,
		visualCodeExample,
		createdAt: Date.now(),
		createdBy: decodedClaims?.uid || null,
		no: (await getAmountOfPolls()) + 1,
	};

	const createPoll = async () => {
		const response = await fetch(`${API_ENDPOINT}/polls/new`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.get("accessToken")}`,
			},
			body: JSON.stringify(poll),
		});

		return response.json();
	};

	const errors = await createPoll();

	if (errors.length > 0) {
		return {
			errors: errors,
		};
	}

	console.log("errors", errors);

	return redirect("/polls");
};

export const loader: LoaderFunction = async ({ request }) => {
	await throwIfNotAuthorized(request);

	return {};
};

export default function NewPoll() {
	return (
		<main>
			<Link to="/polls">Back to list of polls</Link>
			<h1>Create new poll</h1>
			<PollForm />
		</main>
	);
}

export type Mode = "edit" | "mark";

const PollForm = () => {
	const action = useActionData();

	const [mode, setMode] = useState<Mode>("edit");
	const [options, setOptions] = useState<PollOption[]>([
		{
			id: "banjo-kazooie",
			value: "",
			formatting: "text",
			isCorrect: false,
			explanation: null,
		},
	]);

	const addOption = () => {
		setOptions([
			...options,
			{
				id: uuidv4(),
				value: "",
				formatting: "text",
				isCorrect: false,
				explanation: null,
			},
		]);
	};

	const removeOption = (id: string) => {
		setOptions(options.filter((option) => option.id !== id));
	};

	const addExplanation = (id: string) => {
		setOptions((prevOptions) =>
			prevOptions.map((option) =>
				option.id === id ? { ...option, explanation: "" } : option
			)
		);
	};

	const removeExplanation = (id: string) => {
		setOptions((prevOptions) =>
			prevOptions.map((option) =>
				option.id === id ? { ...option, explanation: null } : option
			)
		);
	};

	const markAsCorrect = (id: string) => {
		setOptions((prevOptions) =>
			prevOptions.map((option) =>
				option.id === id
					? { ...option, isCorrect: !option.isCorrect }
					: option
			)
		);
	};

	const onChangeOption = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { id, value } = event.target;

		setOptions((prevOptions) =>
			prevOptions.map((option) =>
				option.id === id ? { ...option, value } : option
			)
		);
	};

	const onChangeExplanationField = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		optionId: string
	) => {
		const { value } = event.target;

		setOptions((prevOptions) =>
			prevOptions.map((option) =>
				option.id === optionId
					? { ...option, explanation: value }
					: option
			)
		);
	};

	const onCMDAndEnterPressed: React.KeyboardEventHandler = (e) => {
		if (e.metaKey && e.key === "Enter") addOption();
	};

	console.log("action", action);

	return (
		<Form method="post" className="form">
			{action?.errors.map((error) => (
				<p key={error}>{error}</p>
			))}
			<textarea name="question" placeholder="Question" defaultValue="" />

			<input
				type="url"
				id="visualCodeExample"
				name="visualCodeExample"
				placeholder="Link to codesandbox example"
			/>

			<textarea
				name="codeBlockExample"
				id="codeBlockExample"
				placeholder="Insert code example"
			/>
			<div>
				Tag:
				<select name="tags" multiple>
					{POLL_TAGS.map((tag) => (
						<option key={tag} value={tag}>
							{tag}
						</option>
					))}
				</select>
			</div>
			<div>
				Type:
				<select name="type">
					{POLL_TYPES.map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>
			</div>
			{options.map((option) => (
				<div key={option.id}>
					<div>
						<textarea
							id={option.id}
							name={`option-${option.id}`}
							placeholder={`Option`}
							onChange={onChangeOption}
							defaultValue={option.value}
							onKeyDown={(e) => onCMDAndEnterPressed(e)}
							disabled={mode === "mark"}
						></textarea>
						{option.isCorrect && <span>✅</span>}
						{!option.explanation && (
							<button
								type="button"
								onClick={() => addExplanation(option.id)}
							>
								Add explanation
							</button>
						)}
						{option.explanation !== null && (
							<>
								<textarea
									id={`explanation-${option.id}`}
									disabled={mode === "mark"}
									name={`explanation-${option.id}`}
									placeholder={`Add an explanation`}
									onChange={(e) =>
										onChangeExplanationField(e, option.id)
									}
									defaultValue={option.explanation}
								></textarea>
								<button
									type="button"
									onClick={() => removeExplanation(option.id)}
								>
									Remove explanation
								</button>
							</>
						)}
					</div>
					{options.length > 1 && mode === "edit" && (
						<button
							type="button"
							onClick={() => removeOption(option.id)}
						>
							Remove option
						</button>
					)}
					{mode === "mark" && (
						<button
							type="button"
							onClick={() => markAsCorrect(option.id)}
						>
							Mark as correct
						</button>
					)}
				</div>
			))}
			<input
				type="hidden"
				name="options"
				value={JSON.stringify(options)}
			/>
			<button
				type="button"
				onClick={addOption}
				disabled={mode === "mark"}
			>
				Add option
			</button>
			{mode === "edit" && (
				<button type="button" onClick={() => setMode("mark")}>
					Mark correct answers
				</button>
			)}
			{mode === "mark" && (
				<button type="button" onClick={() => setMode("edit")}>
					Edit options
				</button>
			)}
			<button type="submit" disabled={mode === "mark"}>
				Create poll
			</button>
		</Form>
	);
};
