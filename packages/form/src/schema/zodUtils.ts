import { z } from "zod";

export const makeOptionalString = <TZod extends z.ZodTypeAny>(
    zodType: TZod
): z.ZodOptional<TZod> =>
    zodType
        .optional()
        .or(
            z.literal("").transform(() => undefined)
        ) as unknown as z.ZodOptional<TZod>;

export const stringToBoolean = z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform<boolean>((value) => {
        console.log(value, value === true || value === "true");
        return value === true || value === "true";
    }) as unknown as z.ZodBoolean;
