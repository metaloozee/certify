import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminEventForm } from "@/components/event-form"
import { EventDataTable } from "@/components/events-data-table"
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

    const { data: events } = await supabase
        .from("event")
        .select("*")
        .order("isopen", { ascending: false })
        .order("date")

    return adminData ? (
        <div className="w-full">
            <Tabs
                defaultValue="manage-events"
                className="flex flex-col justify-center items-center"
            >
                <div className="tabs flex justify-center">
                    <TabsList className="my-5">
                        <TabsTrigger value="manage-events">
                            Manage Events
                        </TabsTrigger>
                        <TabsTrigger value="new-event">
                            Create New Event
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="manage-events" className="container w-full">
                    {events && events.length > 0 ? (
                        <EventDataTable data={events} />
                    ) : (
                        <h1 className="text-center text-2xl md:text-3xl font-light">
                            No past events
                        </h1>
                    )}
                </TabsContent>
                <TabsContent value="new-event" className="container max-w-xl">
                    <AdminEventForm session={session} />
                </TabsContent>
            </Tabs>
        </div>
    ) : (
        <div className="flex flex-col gap-2 justify-center items-center text-center">
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p className="text-slate-500">
                You don't have enough permissions to access this page.
            </p>
        </div>
    )
}
