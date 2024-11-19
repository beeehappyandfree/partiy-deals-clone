import { z } from "zod";
import { removeTrailingSlash } from "@/lib/utils";

export const productDetailsSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    url: z.string().url().min(1, "Website URL is required").transform(removeTrailingSlash),
    description: z.string().optional()
})
