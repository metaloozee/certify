import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { EventCard } from "@/components/event-card"

export const dynamic = "force-dynamic"

export default async function Index() {
    const supabase = await createServerComponentClient<Database>({ cookies })

    const { data } = await supabase.from("event").select("*").eq("isopen", true)

    return data && data.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-3xl font-bold">Upcoming Events</h1>
            <div className="flex flex-wrap justify-between items-center gap-5">
                {data.map((d) => (
                    <EventCard data={d} />
                ))}
            </div>
        </div>
    ) : (
        <h1>No Upcoming Events</h1>
    )
}
