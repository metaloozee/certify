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

import { TemplateConfigForm } from "./template-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export const EndEventForm = ({ event }: { event: EventData }) => {
    const router = useRouter()
    const { supabase } = useSupabase()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [nameCords, setNameCords] = useState<object | null>(null)
    const [departmentCords, setDepartmentCords] = useState<object | null>(null)
    const [eventCords, setEventCords] = useState<object | null>(null)
    const [dateCords, setDateCords] = useState<object | null>(null)
    const [winnerDeclared, setWinnerDeclared] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)

            const { error } = await supabase
                .from("event")
                .update({
                    isopen: false,
                })
                .eq("id", event.id)
            if (error) {
                throw new Error(error.message)
            }

            setSuccess(true)
            router.push("/admin")
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return winnerDeclared ? (
        <div>
            <h3 className="text-xl font-bold mb-10">
                Please upload and configure your template
            </h3>
            <div className="container max-w-xl">
                <Tabs defaultValue="ongoing-events" className="w-full">
                    <TabsList>
                        <TabsTrigger value="winner-config">Winner</TabsTrigger>
                        <TabsTrigger value="firstrunner-config">
                            First Runner Up
                        </TabsTrigger>
                        <TabsTrigger value="secondrunner-config">
                            Second Runner Up
                        </TabsTrigger>
                        <TabsTrigger value="participant-config">
                            Participant
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="winner-config">
                        <TemplateConfigForm event={event} />
                    </TabsContent>
                    <TabsContent value="firstrunner-config">
                        <TemplateConfigForm event={event} />
                    </TabsContent>
                    <TabsContent value="secondrunner-config">
                        <TemplateConfigForm event={event} />
                    </TabsContent>
                    <TabsContent value="participant-config">
                        <TemplateConfigForm event={event} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    ) : (
        <div>
            <form className="space-y-8 w-full">
                <Button
                    onClick={() => setWinnerDeclared(true)}
                    disabled={loading === !success}
                    className="w-full"
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
