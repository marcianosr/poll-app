import {
  z,
  ZodString,
  ZodNumber,
  ZodUnion,
  ZodArray,
  ZodObject,
  ZodOptional,
} from "zod";

export const zodToDescription = <Z extends z.ZodTypeAny>(zod: Z): string => {
  if (zod instanceof ZodString) {
    return "string";
  }
  if (zod instanceof ZodNumber) {
    return "number";
  }
  if (zod instanceof ZodOptional) {
    return `${zodToDescription(zod.unwrap())} | undefined`;
  }
  if (zod instanceof ZodUnion) {
    return zod.options.map(zodToDescription).join(" | ");
  }
  if (zod instanceof ZodArray) {
    const elementStr = zodToDescription(zod.element);
    return `${elementStr.includes(" ") ? `(${elementStr})` : elementStr}[]`;
  }
  if (zod instanceof ZodObject) {
    const keys = Object.keys(zod.keyof().Values);
    if (keys.length === 0) return "{}";

    return `{\n${keys
      .map((key) => {
        const isOptional = zod.shape[key] instanceof ZodOptional;
        return `  ${key}${isOptional ? "?" : ""}: ${zodToDescription(
          zod.shape[key]
        )};\n`;
      })
      .join("")}}`;
  }

  return "never";
};
