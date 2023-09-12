import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"

export default async function EventPage({ params }: { params: any }) {
    const supabase = await createServerComponentClient<Database>({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: event } = await supabase
        .from("event")
        .select("*")
        .eq("id", params.id)
        .eq("isopen", true)
        .single()

    return session?.user && event ? (
        <h1>{event.name}</h1>
    ) : (
        <h1>An Unknown Error Occurred! Please login or try again later</h1>
    )
}
