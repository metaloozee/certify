import { Badge } from "@/components/ui/badge"
import { DeleteButton } from "@/components/delete-button"
import { EditEventDialog } from "@/components/edit-event-dialog"
import { EndEventForm } from "@/components/end-event-form"
import { MemberDataTable } from "@/components/member-data-table"
import { RefreshButton } from "@/components/refresh-button"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function AdminEventPage({ params }: { params: any }) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: eventData } = await supabase
        .from("event")
        .select("*")
        .eq("id", params.id)
        .single()
    const { data: adminData, error: adminDataError } = await supabase
        .from("admin")
        .select("*")
        .eq("id", session?.user.id ?? "")
        .maybeSingle()

    const { data: eventParticipantData, error: eventParticipantError } =
        await supabase
            .from("eventparticipant")
            .select(
                `
            id,
            event_id,
            group (
                id,
                name,
                groupmember (
                    student (
                        *
                    )
                )
            )

        `
            )
            .eq("event_id", eventData?.id ?? "")

    return adminData && eventData && eventParticipantData ? (
        <div className="container w-full">
            <div className="flex flex-col items-left justify-center">
                <div className="flex flex-row flex-wrap justify-between items-start">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-row flex-wrap gap-10">
                            <h1 className="text-3xl font-bold">
                                {eventData.name}
                            </h1>
                            <div className="flex flex-row gap-3">
                                <Badge variant={"outline"}>
                                    {eventData.date}
                                </Badge>
                                <Badge variant={"outline"}>
                                    Maximum Team Members: {eventData.team_limit}
                                </Badge>
                            </div>
                        </div>

                        <p className="text-slate-500 max-w-xl">
                            {eventData.description}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <RefreshButton />
                        <EditEventDialog event={eventData} />
                        <DeleteButton event={eventData} />
                    </div>
                </div>

                <div className="mt-16">
                    <MemberDataTable data={eventParticipantData} />
                </div>

                <div className="mt-10">
                    <EndEventForm event={eventData} />
                </div>
            </div>
        </div>
    ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p>You don't have enough permissions to access this page.</p>
        </div>
    )
}
