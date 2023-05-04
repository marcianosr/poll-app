import { initServerFirebase } from "@marcianosrs/server-auth";
export const { auth, app, db } = initServerFirebase();

export { getUserRole } from "@marcianosrs/api";
