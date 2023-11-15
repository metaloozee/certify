import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export type EventData = {
    id: string
    name: string | null
    description: string | null
    date: string | null
    isopen: boolean | null
    team_limit: number
}

export const EventCard = async ({ data }: { data: EventData }) => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: event } = await supabase
        .from("event")
        .select("*")
        .eq("id", data.id)
        .eq("isopen", true)
        .single()
    const { data: groups, error: groupError } = await supabase
        .from("eventparticipant")
        .select(`group!inner(id, groupmember!inner(student_id))`)
        .eq("group.groupmember.student_id", session?.user.id ?? "")
        .eq("event_id", event?.id ?? "")

    let eventDate = new Date(data.date ?? "")
    let now = new Date()
    let timeRemaining = eventDate.getTime() - now.getTime()

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )

    return (
        <Card className="w-full h-full flex flex-col justify-between">
            <div>
                <CardHeader>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>{data.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Badge>MAX MEMBERS: {data.team_limit}</Badge>
                    <p className="text-sm text-green-500">
                        {`Starts in: ${days} days, ${hours} hours` ??
                            "loading.."}
                    </p>
                </CardContent>
            </div>
            <CardFooter className="justify-end">
                {groups && groups?.length > 0 ? (
                    <Button className="w-full" disabled>
                        Already Registered
                    </Button>
                ) : (
                    <Button className="w-full">
                        <Link className="w-full" href={`/event/${data.id}`}>
                            Register
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export const AdminOngoingEventCard = async ({ data }: { data: EventData }) => {
    let eventDate = new Date(data.date ?? "")
    let now = new Date()
    let timeRemaining = eventDate.getTime() - now.getTime()

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )

    return (
        <Card className="w-full  flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Badge>MAX MEMBERS: {data.team_limit}</Badge>
                <p className="text-sm text-green-500">
                    {`Starts in: ${days} days, ${hours} hours` ?? "loading.."}
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link className="w-full" href={`/admin/event/${data.id}`}>
                        Manage Event
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export const AdminEndedEventCard = async ({ data }: { data: EventData }) => {
    return (
        <Card className="w-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Badge>MAX MEMBERS: {data.team_limit}</Badge>
                <p className="text-sm text-green-500">
                    {new Date(data.date ?? "").toDateString()}
                </p>
            </CardContent>
            <CardFooter>
                <Link className="w-full" href={`/admin/event/${data.id}`}>
                    <Button className="w-full">Manage Event</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
