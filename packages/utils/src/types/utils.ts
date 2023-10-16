export type OmitNever<T extends Record<string, unknown>> = Omit<
    T,
    KeysOfType<T, never>
>;

export type KeysOfType<T extends Record<string, unknown>, Value> = {
    [Key in keyof T]: T[Key] extends Value ? Key : never;
}[keyof T];
