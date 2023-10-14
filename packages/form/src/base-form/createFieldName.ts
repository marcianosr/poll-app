export const createFieldName = (path: string[]) =>
    path.length > 1 ? `${path[0]}[${[...path.slice(1)].join("][")}]` : path[0];
