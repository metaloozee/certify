import Link from "next/link"

import type { Database } from "@/types/supabase"
import { EventCard } from "@/components/event-card-home"

import { createServerSupabaseClient } from "./supabase-server"

export default async function Index() {
    const supabase = await createServerSupabaseClient()
    const { data: session } = await supabase.auth.getSession()
    const { data } = await supabase.from("event").select("*").eq("isopen", true)

    return data && data.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-center text-2xl md:text-3xl font-light">
                Upcoming Competetions
            </h1>
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-5">
                {data.reverse().map((d) => (
                    <EventCard
                        key={d.id}
                        eventdata={d}
                        session={session.session}
                    />
                ))}
            </div>
        </div>
    ) : (
        <h1 className="text-3xl font-bold">No Upcoming Competetions</h1>
    )
}
