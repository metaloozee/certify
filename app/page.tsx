import Link from "next/link"

import type { Database } from "@/types/supabase"
import { EventCard } from "@/components/event-card"

import { createServerSupabaseClient } from "./supabase-server"

export default async function Index() {
    const supabase = await createServerSupabaseClient()

    const { data } = await supabase.from("event").select("*").eq("isopen", true)

    return data && data.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-3xl font-bold">Upcoming Competetions</h1>
            <div className="flex flex-wrap justify-between items-center gap-5">
                {data.reverse().map((d) => (
                    <EventCard key={d.id} data={d} />
                ))}
            </div>
        </div>
    ) : (
        <h1>No Upcoming Competetions</h1>
    )
}
