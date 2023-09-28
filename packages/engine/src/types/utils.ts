export type OmitNever<T extends Record<string, unknown>> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends never ? never : Key;
  }[keyof T]
>;
