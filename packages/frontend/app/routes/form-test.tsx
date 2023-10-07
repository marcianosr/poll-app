import type { ActionFunction } from "@remix-run/node";
import { ZodArray, ZodObject, z } from "zod";
import { formAction } from "~/form-action.server"; /* path to your custom formAction */
import { makeDomainFunction } from "domain-functions";
import { Form } from "~/form"; /* path to your custom Form */

const plugin = () =>
  z.object({
    multiplier: z.number().min(0.1).max(5).default(1.0),
  });

const schema = z.object({
  product: z.enum(["multiplier", "item"]),
  productSettings: plugin(),

  channelName: z.string().min(1),
  teams: z
    .array(
      z.object({
        name: z.string().min(1),
        key: z.string().min(1),
        color: z.string(),
      })
    )
    .min(1),
});

type Data = z.infer<typeof schema>;

const mutation = makeDomainFunction(schema)(
  async (values) =>
    console.log(values) /* or anything else, like saveMyValues(values) */
);

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    // successPath: "/success" /* path to redirect on success */,
  });

export default function FormTest() {
  return (
    <main>
      <h1>Form testing area</h1>
      <Form
        schema={schema}
        values={{
          channelName: "FLuttterz",
          teams: [{ name: "Huffelpuf" }],
          productSettings: { multiplier: 2 },
        }}
        renderField={({ Field, ...props }) => {
          const { shape, name, label, required, value } = props;
          console.log(value);

          if (shape instanceof ZodObject) {
            return (
              <Field key={name} {...props}>
                {({ Label, Errors }) => {
                  return (
                    <>
                      {<Label />}
                      <p>
                        An object here{" "}
                        {value === undefined
                          ? "undefined"
                          : JSON.stringify(value)}
                      </p>
                      {<Errors />}
                    </>
                  );
                }}
              </Field>
            );
          }

          if (shape instanceof ZodArray) {
            return (
              <Field key={name} {...props}>
                {({ Label, Errors }) => {
                  return (
                    <>
                      {<Label />}
                      <p>An list here</p>
                      {<Errors />}
                    </>
                  );
                }}
              </Field>
            );
          }

          return (
            <Field key={name} {...props}>
              {({ Label, SmartInput, Errors }) => {
                const labelElement = (
                  <Label>
                    {label}
                    {required && <sup>*</sup>}
                  </Label>
                );

                const inputWithLabel = (
                  <>
                    {labelElement}
                    <SmartInput />
                  </>
                );

                return (
                  <>
                    {inputWithLabel}
                    <Errors />
                  </>
                );
              }}
            </Field>
          );
        }}
      />
    </main>
  );
}
