import { createForm } from "remix-forms";
import {
  Form as FrameworkForm,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";

export const RemixForm = createForm({
  component: FrameworkForm,
  useNavigation,
  useSubmit,
  useActionData,
});
