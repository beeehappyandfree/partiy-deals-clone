import { db } from "@/drizzle/db"
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema"
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache"
import { eq } from "drizzle-orm"

export async function deleteUser(clerkUserId: string) {
  const [userSubscriptions, products] = await db.transaction(async (tx) => {
    const userSubs = await tx
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId))
      .returning({
        id: UserSubscriptionTable.id,
      })

    const prods = await tx
      .delete(ProductTable)
      .where(eq(ProductTable.clerkUserId, clerkUserId))
      .returning({
        id: ProductTable.id,
      })

    return [userSubs, prods]
  })

  userSubscriptions.forEach(sub => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      id: sub.id,
      userId: clerkUserId,
    })
  })

  products.forEach(prod => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      id: prod.id,
      userId: clerkUserId,
    })
  })

  return [userSubscriptions, products]
}