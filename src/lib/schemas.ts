import { z } from "zod";

export const businessSchema = z.object({
  name: z.string().min(2, "Business name is required (min 2 characters)"),
  state: z.string().min(2, "State is required (min 2 characters)"),
  tin: z.string().optional(),
});
