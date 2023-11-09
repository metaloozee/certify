import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AdminEndedEventCard,
    AdminOngoingEventCard,
} from "@/components/event-card"
import { AdminEventForm } from "@/components/event-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function AdminPage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: adminData, error: adminDataError } = await supabase
        .from("admin")
        .select("*")
        .eq("id", session?.user.id ?? "")
        .maybeSingle()

    const { data: currentEvents } = await supabase
        .from("event")
        .select("*")
        .eq("isopen", true)
    const { data: pastEvents } = await supabase
        .from("event")
        .select("*")
        .eq("isopen", false)

    return adminData ? (
        <div className="max-w-xl">
            <Tabs defaultValue="ongoing-events" className="w-full">
                <div className="tabs w-full flex justify-center">
                    <TabsList className="my-5">
                        <TabsTrigger value="ongoing-events">
                            Ongoing Events
                        </TabsTrigger>
                        <TabsTrigger value="past-events">
                            Past Events
                        </TabsTrigger>
                        <TabsTrigger value="new-event">
                            Create New Event
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent
                    value="ongoing-events"
                    className="flex justify-center"
                >
                    <div className="flex flex-wrap justify-between items-center gap-5">
                        {currentEvents
                            ?.reverse()
                            ?.map((d) => (
                                <AdminOngoingEventCard key={d.id} data={d} />
                            ))}
                    </div>
                </TabsContent>
                <TabsContent value="past-events">
                    <div className="flex flex-wrap justify-between items-center gap-5">
                        {pastEvents?.map((d) => (
                            <AdminEndedEventCard key={d.id} data={d} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="new-event">
                    <AdminEventForm session={session} />
                </TabsContent>
            </Tabs>
        </div>
    ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p>You don't have enough permissions to access this page.</p>
        </div>
    )
}
