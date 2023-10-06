import type { FormDataObject, TypedForm } from "@marcianosrs/form";
import { Form } from "@marcianosrs/form";
import { useState } from "react";

const formSchema = [
  {
    name: "name",
    displayName: "Naam",
    fieldType: "text",
    valueType: "string",
    defaultValue: "",
    optional: false,
  },
] as const satisfies TypedForm;

export default function FormTest() {
  const [formData, setFormData] = useState<FormDataObject<typeof formSchema>>();
  return (
    <main>
      <h1>Form testing area</h1>
      <Form schema={formSchema} onDataUpdate={setFormData} />

      <output>{JSON.stringify(formData)}</output>
    </main>
  );
}
