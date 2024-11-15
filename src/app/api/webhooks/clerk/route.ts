import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { env } from '@/data/env/server'
import { createUserSubcription } from '@/server/db/subscription'
import { deleteUserSubscription } from '@/server/db/users'
export async function POST(req: Request) {
    // Get the headers
    const headerPayload = headers()
    const svixId = headerPayload.get('svix-id')
    const svixTimestamp = headerPayload.get('svix-timestamp')
    const svixSignature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)

    let event: WebhookEvent

    // Verify the payload with the headers
    try {
        event = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400,
        })
    }

    switch (event.type) {
        case 'user.created':
            console.log('User created:', event.data)
            const userId = event.data.id
            await createUserSubcription({
                clerkUserId: userId,
                tier: 'Free',
            }) 
            break
        case 'user.deleted':
            console.log('User deleted:', event.data)
            if (event.data.id != null) {
                await deleteUserSubscription(event.data.id)
            }
            break
    }

    return new Response('', { status: 200 })
}