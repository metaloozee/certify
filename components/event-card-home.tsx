"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Session } from "@supabase/supabase-js"
import { ArrowDown } from "lucide-react"

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
import { EventData } from "@/components/event-card"
import fetchGroups from "@/app/actions"
import { useSupabase } from "@/app/supabase-provider"

export const EventCard = ({
    eventdata,
    session,
}: {
    eventdata: EventData
    session: Session | null
}) => {
    const [groups, setGroups] = useState<any[] | null>(null)
    const [members, setMembers] = useState<any[] | null>(null)

    useEffect(() => {
        const fetch = async () => {
            const data = await fetchGroups(eventdata)
            if (data) {
                setGroups(data.groups)
                setMembers(data.members)
            }
        }

        fetch()
    }, [])

    let eventDate = new Date(eventdata.date ?? "")
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
                    <CardTitle>{eventdata.name}</CardTitle>
                    <CardDescription>{eventdata.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Badge>MAX MEMBERS: {eventdata.team_limit}</Badge>
                    <p className="text-sm text-green-500">
                        {`Starts in: ${days} days, ${hours} hours` ??
                            "loading.."}
                    </p>
                </CardContent>
            </div>
            <CardFooter className=" justify-around">
                {groups && groups.length > 0 ? (
                    <div className="flex">
                        <Button className="mr-2" disabled>
                            Already Registered
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"}>
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4>Group Members</h4>
                                        {members &&
                                            members.map((member) => {
                                                return (
                                                    <p
                                                        className="text-slate-300 text-sm"
                                                        key={
                                                            member.student
                                                                .enrollment
                                                        }
                                                    >
                                                        {
                                                            member.student
                                                                .first_name
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                            member.student
                                                                .enrollment
                                                        }
                                                    </p>
                                                )
                                            })}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button className="w-full">
                        <Link
                            className="w-full"
                            href={`/event/${eventdata.id}`}
                        >
                            Register
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
