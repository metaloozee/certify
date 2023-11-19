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

    const { data: user, error: userError } = await supabase
        .from("student")
        .select("enrollment")
        .eq("id", session?.user.id ?? "")
        .single()

    const { data: groups, error: groupError } = await supabase
        .from("eventparticipant")
        .select(`group!inner(id, groupmember!inner(student_id))`)
        .eq("group.groupmember.student_id", session?.user.id ?? "")
        .eq("event_id", event?.id ?? "")

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
    }

    if (userError || groupError || !event) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold">
                    An Unknown Error Occurred
                </h1>
                <p>
                    Sorry for the inconvienience. Try again later, if the same
                    error occurs then kindly contact the admins!
                </p>
                {userError && <pre>{userError}</pre>}
                {groupError && <pre>{groupError.message}</pre>}
            </div>
        )
    }

    if (groups && groups?.length > 0) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold">Already Registered</h1>
                <p>
                    You have already registered yourself in this event, kindly
                    contact the admins if you want to remove yourself.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
            <div className="container space-y-2 text-center">
                <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
                <p className="text-slate-500 text-xs md:text-lg">
                    {event.description}
                </p>
            </div>
            <EventForm session={session} event={event} user={user} />
        </div>
    )
}
