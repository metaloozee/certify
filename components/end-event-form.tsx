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

export const EndEventForm = ({ event }: { event: EventData }) => {
    const router = useRouter()
    const { supabase } = useSupabase()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [resultDeclared, setResultDeclared] = useState(false)

    const [cords, setCords] = useState<number[][]>([
        [-1, -1], // name
        [-1, -1], // class
        [-1, -1], // date
        [-1, -1], // event
        [-1, -1], // position
    ])

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
            console.log(cords)
        }
    }

    return resultDeclared ? (
        <div>
            <h3 className="text-xl font-bold mb-10">
                Please upload and configure your template
            </h3>
            <div className="container max-w-xl">
                <TemplateConfigForm cords={cords} setCords={setCords} />
            </div>
            <div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading === !success}
                    className="w-full"
                >
                    End Event and Generate Certificates
                </Button>
            </div>
        </div>
    ) : (
        <div>
            <form className="space-y-8 w-full">
                <Button
                    onClick={() => setResultDeclared(true)}
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
