import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { EventForm } from "@/components/event-form"

export default async function EventPage({ params }: { params: any }) {
    const supabase = createServerComponentClient<Database>({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: event } = await supabase
        .from("event")
        .select("*")
        .eq("id", params.id)
        .eq("isopen", true)
        .single()
    const { data: user, error } = await supabase
        .from("student")
        .select("enrollment")
        .eq("id", session?.user.id ?? "")
        .single()

    return !error && user.enrollment && session?.user && event ? (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <EventForm session={session} event={event} user={user} />
        </div>
    ) : (
        <h1>An Unknown Error Occurred! Please login or try again later</h1>
    )
}
