"use client"

import { useEffect, useState } from "react"
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons"
import type { Session } from "@supabase/auth-helpers-nextjs"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
        if (enrollmentNumbers[0].length === 0) {
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
            if (memberEnrollmentNumbers[0].length > 0) {
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
