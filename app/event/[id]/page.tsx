import { EventForm } from "@/components/event-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function EventPage({ params }: { params: any }) {
    const supabase = await createServerSupabaseClient()

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

    if (!session || !user) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold">Unauthorized</h1>
                <p>
                    Please login or setup your account in order to participate
                    in our event!
                </p>
            </div>
        )
    } else if (error || !event) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold">
                    An Unknown Error Occurred
                </h1>
                <p>
                    Sorry for the inconvienience. Try again later, if the same
                    error occurs then kindly contact the admins!
                </p>
                <pre>{error}</pre>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <EventForm session={session} event={event} user={user} />
        </div>
    )
}
