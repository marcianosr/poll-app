import React from "react";

type HiddenFormDataProps = {
  object: unknown;
  prefix: string[];
};

const createFieldName = (path: string[]) =>
  `${path[0]}[${[...path.slice(1)].join("][")}]`;

const objectToFormMapping = (
  prefix: string[],
  object: unknown
): Record<string, string> => {
  if (Array.isArray(object)) {
    return object.reduce(
      (result, item, index) => ({
        ...result,
        ...objectToFormMapping([...prefix, `${index}`], item),
      }),
      {}
    );
  }
  if (typeof object === "object" && object !== null) {
    return Object.entries(object).reduce(
      (result, [name, value]) => ({
        ...result,
        ...objectToFormMapping([...prefix, name], value),
      }),
      {}
    );
  }

  return { [createFieldName(prefix)]: `${object}` };
};

export const HiddenFormData: React.FC<HiddenFormDataProps> = ({
  object,
  prefix,
}) => {
  const fields = objectToFormMapping(prefix, object);
  return (
    <>
      {Object.entries(fields).map(([name, value]) => (
        <input type="hidden" name={name} value={value} key={name} />
      ))}
    </>
  );
};
