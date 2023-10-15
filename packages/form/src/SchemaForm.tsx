import React from "react";
import { RemixForm } from "./RemixForm";
import { type ZodSchemaType, schemaToZod } from "./schema/schemaToZod";
import { FormField } from "./base-form/FormField";
import { FieldProvider } from "./base-form/FieldContext";
import { z } from "zod";
import {
	schemaToDefaultValues,
	type TypedForm,
} from "@marcianosrs/form-schema";
import { Button as SubmitButton } from "@marcianosrs/ui";
import { HiddenFormData } from "./base-form/HiddenFormData";
import { zodToDescription } from "@marcianosrs/utils";

const FORM_ID_FIELD = "__formAction";

type SchemaFormProps<Schema extends TypedForm> = {
	schema: Schema;
	formId: string;
};

interface FormValues {
	[x: string]: unknown | unknown[];
}

type RemixFormValues<Schema extends TypedForm> = Partial<
	Record<keyof z.infer<ZodSchemaType<Schema>>, unknown>
>;

export const getFormId = async (
	request: Request
): Promise<FormDataEntryValue | null> =>
	(await request.clone().formData()).get(FORM_ID_FIELD);

export const SchemaForm = <Schema extends TypedForm>({
	schema,
	formId,
}: SchemaFormProps<Schema>) => {
	const zodSchema = schemaToZod(schema);
	const values: FormValues = schemaToDefaultValues(schema);

	return (
		<RemixForm
			schema={zodSchema}
			values={values as RemixFormValues<Schema>}
		>
			{({
				Field,
				Errors,
				watch,
				setValue,
				register,
				formState,
				...rest
			}) => (
				<FieldProvider
					watch={watch}
					setValue={setValue}
					register={register}
					state={formState}
				>
					{/* {console.log("ERROR", Errors, "formState", formState)} */}
					<input type="hidden" name={FORM_ID_FIELD} value={formId} />
					{schema.map((field) => (
						<Field key={field.name} name={field.name}>
							{() => <FormField key={field.name} field={field} />}
						</Field>
					))}
					{schema.map((field) => (
						<HiddenFormData field={field} key={field.name} />
					))}
					Error: <Errors />
					<SubmitButton type="submit">Ok!</SubmitButton>
				</FieldProvider>
			)}
		</RemixForm>
	);
};
