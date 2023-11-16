import React, { useState } from "react";
import type { FormFieldPlugin, FormFieldProps } from "../types/field-plugin";
import { z } from "zod";
import { ObjectScopeProvider, useCustomField } from "../base-form/FieldContext";
import { transform } from "@marcianosrs/utils";
import { FormFields } from "../base-form/FormFields";
import { FormFieldValue } from "../base-form/FormFieldValue";
import { Button, Table } from "@marcianosrs/ui";
import {
	schemaToDefaultValues,
	type FormDataObject,
	type ObjectListField,
	type TypedForm,
	type ValueTypeOfField,
} from "@marcianosrs/form-schema";

const ObjectList = <TForm extends TypedForm>({
	field,
}: FormFieldProps<ObjectListField<string, TForm>>) => {
	const { watch, setValue, errors, hasErrors } = useCustomField(field);
	const objectSchema = field.objectSchema;
	type RecordType = FormDataObject<typeof field.objectSchema>;
	const objectList = watch();
	const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

	const resetValues = schemaToDefaultValues(
		objectSchema
	) as unknown as RecordType;
	// Maybe add option to object list to display as table or as cards?
	return (
		<div>
			<label>{field.displayName}</label>
			<div>
				<Table
					data={objectList}
					headers={objectSchema
						.filter(
							(field) =>
								field.valueType !== "none" &&
								field.fieldType !== "hidden"
						)
						.map<React.ReactNode>((field) => field.displayName)
						.concat(null)}
					mapDataToRow={(item, index) => {
						const cells = objectSchema
							.filter(
								(field) =>
									field.valueType !== "none" &&
									field.fieldType !== "hidden"
							)
							.map((field) => (
								<FormFieldValue
									field={field}
									value={
										item[
											field.name as keyof RecordType
										] as ValueTypeOfField<typeof field>
									}
								/>
							))
							.concat(
								<>
									<Button
										onClick={() => {
											setEditIndex(index);
										}}
										disabled={editIndex === index}
									>
										Edit
									</Button>{" "}
									<Button
										onClick={() => {
											setEditIndex(undefined);
											setValue(
												objectList.filter(
													(e) => e !== item
												)
											);
										}}
									>
										Remove
									</Button>
									{hasErrors([`${index}`]) && (
										<span title="Item has errors">⚠️</span>
									)}
								</>
							);

						const detailRow =
							editIndex === index ? (
								<fieldset>
									<legend>Edit item</legend>
									<ObjectScopeProvider<RecordType>
										path={[`${field.name}`, `${index}`]}
										defaultValues={item}
									>
										{({ getValues }) => (
											<>
												<FormFields
													schema={objectSchema}
												/>
												<Button
													onClick={(event) => {
														event.preventDefault();
														setEditIndex(undefined);
														setValue(
															objectList.map<RecordType>(
																(item, index) =>
																	index ===
																	editIndex
																		? {
																				...getValues(),
																		  }
																		: item
															)
														);
													}}
												>
													Update item
												</Button>
											</>
										)}
									</ObjectScopeProvider>
								</fieldset>
							) : null;

						return { cells, detailRow };
					}}
				/>

				<Button
					onClick={(event) => {
						event.preventDefault();
						setValue(objectList.concat({ ...resetValues }));
						setEditIndex(objectList.length);
					}}
				>
					Add Item
				</Button>
			</div>
			{errors?.map((e, i) => (
				<p key={i}>{e}</p>
			))}
		</div>
	);
};

export const objectListPlugin: FormFieldPlugin<
	ObjectListField<string, TypedForm>,
	z.ZodArray<z.ZodTypeAny> | z.ZodOptional<z.ZodArray<z.ZodTypeAny>>
> = {
	fieldType: "objectList",
	Component: ObjectList,
	Show: ({ value = [] }) => `${value.length} items`,
	toZodSchema: (field, resolver) =>
		transform(resolver(field.objectSchema).array())
			.apply(field.minimalAmount, (z, min) =>
				min > 0
					? z.min(min, {
							message: `List must contain at least ${min} ${field.displayName}`,
					  })
					: z.optional()
			)
			.result(),
};
