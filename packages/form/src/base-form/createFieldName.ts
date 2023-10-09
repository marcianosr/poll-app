export const createFieldName = (
  keyPrefix: string[] | undefined,
  name: string
) =>
  keyPrefix
    ? `${keyPrefix[0]}[${[...keyPrefix.slice(1), name].join("][")}]`
    : name;
