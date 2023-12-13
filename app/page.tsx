import { EventCard } from "@/components/event-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function Index() {
    const supabase = await createServerSupabaseClient()

    const { data } = await supabase
        .from("event")
        .select("*")
        .eq("isopen", true)
        .order("date")

    return data && data.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-center text-2xl md:text-3xl font-light">
                Upcoming Competitions
            </h1>
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-5">
                {data.map((d) => (
                    <EventCard key={d.id} data={d} />
                ))}
            </div>
        </div>
    ) : (
        <h1 className="text-center text-2xl md:text-3xl font-light">
            No Upcoming Competitions
        </h1>
    )
}
