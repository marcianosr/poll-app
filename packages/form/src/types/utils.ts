type NeverKeys<T extends Record<string, unknown>> = {
  [Key in keyof T]: T[Key] extends never ? never : Key;
}[keyof T];

export type OmitNever<T extends Record<string, unknown>> = Pick<
  T,
  NeverKeys<T>
>;
