import { initServerFirebase } from "@marcianosrs/server-auth";

export const { db, auth, FieldValue } = initServerFirebase();
