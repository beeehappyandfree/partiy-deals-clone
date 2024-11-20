import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import { CACHE_TAGS, getUserTag , dbCache, getIdTag, revalidateDbCache} from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function getProducts(userId: string, { limit }: { limit: number }) {
    const cacheFn = dbCache(getProductsInternal, { 
        tags: [getUserTag(userId, CACHE_TAGS.products)]
     })
    return cacheFn(userId, { limit })
}

export function getProduct({ id, userId }: { id: string; userId: string }) {
    const cacheFn = dbCache(getProductInternal, {
      tags: [getIdTag(id, CACHE_TAGS.products)],
    })
  
    return cacheFn({ id, userId })
}

export async function createProduct(data: typeof ProductTable.$inferInsert) {
    const [newProduct] = await db
        .insert(ProductTable)
        .values(data)
        .returning({ id: ProductTable.id, userId: ProductTable.clerkUserId })
    try {
        await db.insert(ProductCustomizationTable).values({
            productId: newProduct.id,
        }).onConflictDoNothing({
            target: ProductCustomizationTable.productId,
        });
    } catch (error) {
        await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id));
    }

    revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId: newProduct.userId,
        id: newProduct.id
    })

    return newProduct;
}

export async function updateProduct(
    data: Partial<typeof ProductTable.$inferInsert>,
    { id, userId }: { id: string; userId: string }
) {
    const result = await db
        .update(ProductTable)
        .set(data)
        .where(and(eq(ProductTable.clerkUserId, userId), eq(ProductTable.id, id)))
        .returning()

    const rowCount = result.length

    if (rowCount > 0) {
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            userId,
            id,
        })
    }

    return rowCount > 0
}

export async function deleteProduct({ id, userId }: { id: string, userId: string }) {  
    const deleted = await db
        .delete(ProductTable)
        .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)))
        .returning()
    
    const rowCount = deleted.length
    
    if (rowCount > 0) {
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            userId,
            id,
        })
    }

    return rowCount > 0
}

function getProductsInternal(userId: string, { limit }: { limit: number }) {
    return db.query.ProductTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        limit, 
    })
}

function getProductInternal({ id, userId }: { id: string; userId: string }) {
    return db.query.ProductTable.findFirst({
      where: ({ clerkUserId, id: idCol }, { eq, and }) =>
        and(eq(clerkUserId, userId), eq(idCol, id)),
    })
  }