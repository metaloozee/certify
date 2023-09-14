"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, ReloadIcon, RocketIcon } from "@radix-ui/react-icons"
import type { Session } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useSupabase } from "@/app/supabase-provider"

export type User = {
    enrollment: string | null
}

export type Event = {
    date: string | null
    description: string | null
    id: string
    isopen: boolean | null
    name: string | null
    team_limit: number
}

export const EventForm = ({
    session,
    event,
    user,
}: {
    session: Session | null
    event: Event
    user: User
}) => {
    const { supabase } = useSupabase()

    const [isLeaderRegistered, setIsLeaderRegistered] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const checkIfLeaderHasRegistered = async () => {
            const { data: groupMemberData, error: groupMemberDataError } =
                await supabase
                    .from("groupmember")
                    .select("*")
                    .eq("student_id", session?.user.id ?? "")
                    .maybeSingle()
            if (groupMemberDataError || !groupMemberData) {
                return setIsLeaderRegistered(false)
            }

            const { data, error } = await supabase
                .from("eventparticipant")
                .select("*")
                .eq("group_id", groupMemberData?.group_id ?? "")
                .eq("event_id", event.id)
                .maybeSingle()
            if (error || !data) {
                return setIsLeaderRegistered(false)
            }

            setIsLeaderRegistered(true)
        }

        checkIfLeaderHasRegistered()
    }, [])

    const [teamName] = useState<string>(() =>
        uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors],
            length: 2,
        })
    )

    const [leaderEnrollmentNumber] = useState(() => user.enrollment ?? "")

    const initialMemberEnrollmentNumbers = Array.from(
        { length: event.team_limit - 1 },
        () => ""
    )
    const [memberEnrollmentNumbers, setMemberEnrollmentNumbers] = useState<
        string[]
    >(initialMemberEnrollmentNumbers as string[])

    const handleMemberEnrollmentNumberChange = (
        index: number,
        value: string | null
    ) => {
        const updatedMembers = [...memberEnrollmentNumbers]
        updatedMembers[index] = value as string
        setMemberEnrollmentNumbers(updatedMembers)
    }

    if (isLeaderRegistered) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold">User Already Registered</h1>
                <p>
                    You have already registered yourself in this event, kindly
                    contact the admins if you want to remove yourself.
                </p>
            </div>
        )
    }

    const checkTeammateRegisteration = async (enrollmentNumbers: string[]) => {
        if (
            (enrollmentNumbers.length > 0 &&
                enrollmentNumbers[0].length === 0) ||
            enrollmentNumbers.length == 0
        ) {
            return false
        }

        for (const enrollmentNumber of enrollmentNumbers) {
            const { data: studentData, error: studentDataError } =
                await supabase
                    .from("student")
                    .select("id")
                    .eq("enrollment", enrollmentNumber)
                    .maybeSingle()

            if (studentDataError) {
                throw new Error(studentDataError.message)
            }

            if (!studentData) {
                throw new Error("Student not found.")
            }

            const { data: groupData, error: groupDataError } = await supabase
                .from("groupmember")
                .select("*")
                .eq("student_id", studentData.id)
                .maybeSingle()

            if (groupDataError) {
                throw new Error(groupDataError.message)
            }

            if (!groupData) {
                return false
            }

            const { data: eventRegistered, error: eventRegisteredError } =
                await supabase
                    .from("eventparticipant")
                    .select("*")
                    .eq("event_id", event.id)
                    .eq("group_id", groupData.group_id ?? "")
                    .maybeSingle()

            if (eventRegisteredError) {
                throw new Error(eventRegisteredError.message)
            }

            if (!eventRegistered) {
                return false
            }

            return true
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)

            const isRegistered = await checkTeammateRegisteration(
                memberEnrollmentNumbers
            )

            if (isRegistered) {
                throw new Error(
                    "One of your team members has already participated in this event."
                )
            }

            // Creating the Group
            const { data: groupData, error: groupDataError } = await supabase
                .from("group")
                .insert({ name: teamName })
                .select("id")
                .single()

            if (groupDataError) {
                throw new Error(groupDataError.message)
            }

            // Adding members to the Group
            if (
                memberEnrollmentNumbers.length > 0 &&
                memberEnrollmentNumbers[0].length > 0
            ) {
                for (const enrollmentNumber of memberEnrollmentNumbers) {
                    const { data: studentData, error: studentDataError } =
                        await supabase
                            .from("student")
                            .select("id")
                            .eq("enrollment", enrollmentNumber)
                            .limit(1)

                    if (studentDataError) {
                        throw new Error(studentDataError.message)
                    }

                    const { error: memberGroupError } = await supabase
                        .from("groupmember")
                        .insert({
                            group_id: groupData.id,
                            student_id: studentData[0].id,
                        })

                    if (memberGroupError) {
                        throw new Error(memberGroupError.message)
                    }
                }
            }

            // Adding the leader
            const { error: memberGroupError } = await supabase
                .from("groupmember")
                .insert({
                    group_id: groupData.id,
                    student_id: session?.user.id,
                })

            if (memberGroupError) {
                throw new Error(memberGroupError.message)
            }

            // Creating event participation
            const { error: eventParticipantError } = await supabase
                .from("eventparticipant")
                .insert({ event_id: event.id, group_id: groupData.id })

            if (eventParticipantError) {
                throw new Error(eventParticipantError.message)
            }

            setSuccess(true)
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10 container max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label>{`Team Leader's Enrollment Number`}</Label>
                    <Input disabled value={leaderEnrollmentNumber} />
                </div>
                {memberEnrollmentNumbers.map((memberNumber, index) => (
                    <div key={index} className="space-y-2">
                        <Label>{`Team Member ${
                            index + 1
                        }'s Enrollment Number`}</Label>
                        <Input
                            disabled={loading}
                            value={memberNumber ?? ""}
                            onChange={(e) =>
                                handleMemberEnrollmentNumberChange(
                                    index,
                                    e.target.value
                                )
                            }
                        />
                    </div>
                ))}

                <Button
                    disabled={loading === !success}
                    className="w-full"
                    type="submit"
                >
                    Register for {event.name}
                </Button>
            </form>

            {error ? (
                <p className="mt-8 text-xs text-red-500">{error}</p>
            ) : (
                <></>
            )}

            {success ? (
                <Alert className="mt-8">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        You have successfully registered for the event!
                    </AlertDescription>
                </Alert>
            ) : (
                <></>
            )}
        </div>
    )
}

export const AdminEventForm = ({ session }: { session: Session | null }) => {
    const { supabase } = useSupabase()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [eventName, setEventName] = useState<string | null>(null)
    const [eventDescription, setEventDescription] = useState<string | null>(
        null
    )
    const [startDate, setStartDate] = useState<Date>()
    const [memberLimit, setMemberLimit] = useState(0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)

            if (
                (eventName && eventName.length > 0) ||
                (eventDescription && eventDescription.length > 0) ||
                startDate
            ) {
                const { error } = await supabase.from("event").insert({
                    name: eventName,
                    description: eventDescription,
                    isopen: true,
                    date: startDate?.toDateString() ?? Date.now().toString(),
                    team_limit: memberLimit,
                })
                if (error) {
                    throw new Error(error.message)
                }

                setSuccess(true)
            } else {
                throw new Error("Please enter valid inputs")
            }
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10 space-y-3">
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={eventName ?? ""}
                            onChange={(e) => setEventName(e.target.value)}
                            disabled={loading}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                            type="text"
                            value={eventDescription ?? ""}
                            onChange={(e) =>
                                setEventDescription(e.target.value)
                            }
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="space-y-2">
                        <Label>Team members limit</Label>
                        <Input
                            type="number"
                            value={memberLimit ?? ""}
                            onChange={(e) =>
                                setMemberLimit(parseInt(e.target.value))
                            }
                            disabled={loading}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <br />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    {startDate ? (
                                        format(startDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={startDate ?? new Date(Date.now())}
                                    onSelect={(e) => {
                                        setStartDate(e)
                                    }}
                                    disabled={(date) =>
                                        date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Button
                    disabled={loading === !success}
                    className="w-full"
                    type="submit"
                >
                    Create New Event
                </Button>
            </form>

            {error ? (
                <p className="mt-8 text-xs text-red-500">{error}</p>
            ) : (
                <></>
            )}

            {success ? (
                <Alert className="mt-8">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        You have successfully registered yourself!
                    </AlertDescription>
                </Alert>
            ) : (
                <></>
            )}
        </div>
    )
}
