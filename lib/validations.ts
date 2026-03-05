import { z } from "zod";
import {
  KEBAB_TYPES,
  SAUCE_OPTIONS,
  KEBAB_SIZES,
  KEBAB_ADDS,
} from "./kebab-config";

export const addOrderSchema = z.object({
  groupCode: z.string().min(1),
  name: z.string().min(1).max(30),
  kebabType: z.enum(KEBAB_TYPES),
  kebabSize: z.enum(KEBAB_SIZES).nullable(),
  sauce: z.enum(SAUCE_OPTIONS),
  hasCheese: z.boolean().nullable(),
  adds: z.array(z.enum(KEBAB_ADDS)),
  userId: z.string().nullable().optional(),
});
