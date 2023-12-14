import Link from "next/link"
import { Users2 } from "lucide-react"

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
        .select(`group!inner(id, name, groupmember!inner(student_id))`)
        .eq("group.groupmember.student_id", session?.user.id ?? "")
        .eq("event_id", event?.id ?? "")
        .maybeSingle()

    const { data: groupMembers, error: groupMembersError } = await supabase
        .from("groupmember")
        .select("student(first_name, last_name, enrollment)")
        .eq("group_id", groups?.group?.id ?? "")

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
                {groups ? (
                    <div className="flex w-full gap-2">
                        <Button className="w-full" disabled>
                            Already Registered
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"}>
                                    <Users2 className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="grid gap-4">
                                    <div className="space-y-1">
                                        <h4>{groups.group?.name}</h4>
                                        {groupMembers?.map((member) => (
                                            <p
                                                className="text-slate-300 text-sm"
                                                key={member.student?.enrollment}
                                            >
                                                {member.student?.first_name}{" "}
                                                {member.student?.last_name} -{" "}
                                                {member.student?.enrollment}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button className="w-full" asChild>
                        <Link className="w-full" href={`/event/${data.id}`}>
                            Register
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
