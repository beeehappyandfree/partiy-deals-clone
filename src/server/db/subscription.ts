import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";

export async function createUserSubcription(data: typeof UserSubscriptionTable.$inferInsert) {
    return db.insert(UserSubscriptionTable).values(data)
        .onConflictDoNothing({
            target: UserSubscriptionTable.clerkUserId,
        })
}
