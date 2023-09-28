"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RocketIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EventData } from "@/components/event-card"
import { useSupabase } from "@/app/supabase-provider"

export const EndEventForm = ({ event }: { event: EventData }) => {
    const router = useRouter()
    const { supabase } = useSupabase()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [winnerId, setWinnerId] = useState<string | null>(null)
    const [runnerUpId, setRunnerUpId] = useState<string | null>(null)
    const [secondRunnerUpId, setSecondRunnerUpId] = useState<string | null>(
        null
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)

            if (winnerId && winnerId.length > 0) {
                const { error } = await supabase
                    .from("event")
                    .update({
                        winner: winnerId,
                        runner_up: runnerUpId ?? null,
                        second_runner_up: secondRunnerUpId ?? null,
                        isopen: false,
                    })
                    .eq("id", event.id)
                if (error) {
                    throw new Error(error.message)
                }

                setSuccess(true)
                router.push("/admin")
            } else {
                throw new Error("There should atleast be a winner.")
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
        <div>
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
                <div className="flex flex-row flex-wrap gap-10 w-full justify-between">
                    <div className="flex flex-col gap-3 w-full">
                        <Label>Winner Group ID</Label>
                        <Input
                            disabled={loading}
                            type="text"
                            value={winnerId ?? ""}
                            onChange={(e) => setWinnerId(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <Label>Runner-Up Group ID</Label>
                        <Input
                            disabled={loading}
                            type="text"
                            value={runnerUpId ?? ""}
                            onChange={(e) => setRunnerUpId(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <Label>Second Runner-Up Group ID</Label>
                        <Input
                            disabled={loading}
                            type="text"
                            value={secondRunnerUpId ?? ""}
                            onChange={(e) =>
                                setSecondRunnerUpId(e.target.value)
                            }
                        />
                    </div>
                </div>

                <Button
                    disabled={loading === !success}
                    className="w-full"
                    type="submit"
                >
                    End Event & Declare Winners
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
