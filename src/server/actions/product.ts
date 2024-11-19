'use server'
import { z } from "zod"
import { productDetailsSchema } from "@/schemas/product"
import { auth } from "@clerk/nextjs/server";
import { createProduct as createProductDB } from "@/server/db/products";
import { redirect } from "next/navigation";

export async function createProduct(
    unsafeData: z.infer<typeof productDetailsSchema>): Promise<{
    error: boolean;
    message: string;
} | undefined> {
    console.log(unsafeData);
    const { userId } = auth();
    const { success, data } = productDetailsSchema.safeParse(unsafeData);
    if (!success || userId === null) {
        return {
            error: true,
            message: "There was an error creating the product"
        }
    }
    const { id } = await createProductDB({...data, clerkUserId: userId});
    redirect(`/dashboard/products/${id}/edit?tab=countries`)
}