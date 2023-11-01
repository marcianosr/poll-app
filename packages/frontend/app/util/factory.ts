import type { TimestampDTO } from "@marcianosrs/engine";

export const createFactory =
	<T>(base: T) =>
	(options?: Partial<T>): T => ({ ...base, ...options });

export const createTimestamp = (dateString: string): TimestampDTO => ({
	_seconds: new Date(dateString).getTime(),
	_nanoseconds: 0,
});
