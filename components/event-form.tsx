"use client"

import { useState } from "react"
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
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
    branchwise: boolean
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

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

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

    const checkTeammateRegisteration = async (enrollmentNumbers: string[]) => {
        if (
            (enrollmentNumbers.length > 0 &&
                enrollmentNumbers[0].length === 0) ||
            enrollmentNumbers.length == 0
        ) {
            return false
        }

        for (const enrollmentNumber of enrollmentNumbers) {
            const { data: groups, error: groupError } = await supabase
                .from("eventparticipant")
                .select(
                    `group!inner(id, groupmember!inner(student_id, student!inner(enrollment)))`
                )
                .eq("event_id", event.id)
                .eq("group.groupmember.student.enrollment", enrollmentNumber)

            if (groupError) {
                throw new Error(groupError.message)
            }

            if (!groups) {
                continue
            }

            if (groups && groups.length > 0) {
                console.log(enrollmentNumber + " is registered")
                return true
            }
        }

        return false
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

            // leader's data
            const { data: leaderData, error: leaderDataError } = await supabase
                .from("student")
                .select("*")
                .eq("id", session?.user.id ?? "")
                .maybeSingle()

            if (leaderDataError) {
                throw new Error(leaderDataError.message)
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

            // Adding members to the Group
            console.log(memberEnrollmentNumbers)
            for (const enrollmentNumber of memberEnrollmentNumbers) {
                if (enrollmentNumber.length === 0) {
                    continue
                }

                const { data: studentData, error: studentDataError } =
                    await supabase
                        .from("student")
                        .select("id, class")
                        .eq("enrollment", enrollmentNumber)
                        .maybeSingle()

                // Checking if the users are from the same branch as the leader or not
                if (event.branchwise === true) {
                    if (
                        studentData?.class?.slice(2) !==
                        leaderData?.class?.slice(2)
                    ) {
                        throw new Error(
                            "Not all of the teammates you listed are from the same branch as you."
                        )
                    }
                }

                if (studentDataError || !studentData) {
                    throw new Error(
                        "One of the enrollment numbers provided by you is invalid or the student has not registered with us." ??
                            studentDataError?.message
                    )
                }

                const { error: memberGroupError } = await supabase
                    .from("groupmember")
                    .insert({
                        group_id: groupData.id,
                        student_id: studentData?.id,
                    })

                if (memberGroupError) {
                    throw new Error(memberGroupError.message)
                }
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
                    <Label>{`Team Name (note this down)`}</Label>
                    <Input disabled value={teamName} />
                </div>
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
    const [isBranchWise, setIsBranchWise] = useState(false)

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
                const { data: insertResult, error } = await supabase
                    .from("event")
                    .insert({
                        name: eventName,
                        description: eventDescription,
                        isopen: true,
                        date:
                            startDate?.toDateString() ?? Date.now().toString(),
                        team_limit: memberLimit,
                        branchwise: isBranchWise,
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
        <div className="space-y-3">
            <h1 className="text-2xl font-bold text-center">Create New Event</h1>
            <form onSubmit={handleSubmit} className="mt-5 w-full space-y-8">
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full space-y-2">
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={eventName ?? ""}
                            onChange={(e) => setEventName(e.target.value)}
                            disabled={loading}
                            className="w-full"
                        />
                    </div>
                    <div className="w-full space-y-2">
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
                    <div className="w-full space-y-2">
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
                    <div className="w-full space-y-2">
                        <Label>Start Date</Label>
                        <br />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
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

                <Card className="w-full flex justify-between items-center">
                    <CardHeader>
                        <CardTitle className="text-md">
                            Enable Branchwise
                        </CardTitle>
                        <CardDescription className="text-sm">
                            If this is enabled, the groups will only contain
                            students from the same branch.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Switch
                            checked={isBranchWise}
                            onCheckedChange={(e) => setIsBranchWise(e)}
                        />
                    </CardContent>
                </Card>

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
                        Event created successfully!
                    </AlertDescription>
                </Alert>
            ) : (
                <></>
            )}
        </div>
    )
}
