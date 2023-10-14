import { z } from "zod";

export const makeOptionalString = <TZod extends z.ZodTypeAny>(
    zodType: TZod
): z.ZodOptional<TZod> =>
    zodType
        .optional()
        .or(
            z.literal("").transform(() => undefined)
        ) as unknown as z.ZodOptional<TZod>;
