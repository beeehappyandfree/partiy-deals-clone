'use server'
import { z } from "zod"
import { productDetailsSchema } from "@/schemas/product"
import { auth } from "@clerk/nextjs/server";
import { 
    createProduct as createProductDB, 
    updateProduct as updateProductDB,
    deleteProduct as deleteProductDb } from "@/server/db/products";
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
    const { id } = await createProductDB({ ...data, clerkUserId: userId });
    redirect(`/dashboard/products/${id}/edit?tab=countries`)
}

export async function updateProduct(
    id: string,
    unsafeData: z.infer<typeof productDetailsSchema>): Promise<{
        error: boolean;
        message: string;
    } | undefined> {
    console.log(unsafeData);
    const { userId } = auth();
    const { success, data } = productDetailsSchema.safeParse(unsafeData);
    const errorMessage = "There was an error updating the product"
    if (!success || userId === null) {
        return {
            error: true,
            message: errorMessage
        }
    }
    const isSuccess = await updateProductDB(data, { id, userId });
    return { error: !isSuccess, message: isSuccess ? "Successfully updated your product" : errorMessage }
}

export async function deleteProduct(id: string) {
    const { userId } = auth()
    const errorMessage = "There was an error deleting your product"

    if (userId == null) {
        return { error: true, message: errorMessage }
    }

    const isSuccess = await deleteProductDb({ id, userId })

    return {
        error: !isSuccess,
        message: isSuccess ? "Successfully deleted your product" : errorMessage,
    }
}