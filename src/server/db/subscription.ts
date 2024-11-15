import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function createUserSubcription(data: typeof UserSubscriptionTable.$inferInsert) {
    return db.insert(UserSubscriptionTable).values(data)
        .onConflictDoNothing({
            target: UserSubscriptionTable.clerkUserId,
        })
}
