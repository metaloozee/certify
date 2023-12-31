"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { env } from "@/env.mjs"
import { ArrowBottomRightIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { CircleIcon, Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import type { EventData } from "@/components/event-card"
import { TemplateConfigForm } from "@/components/template-config"
import { downloadFile } from "@/components/utils"
import { useSupabase } from "@/app/supabase-provider"

interface RequestFormat {
    event_id: string
    name_cords: number[]
    class_cords: number[]
    eventname_cords: number[]
    date_cords: number[]
    postion_cords: number[]
    fontSize: number
    template_url: string
    token: string | undefined
    test: boolean
}

export const EndEventForm = ({ event }: { event: EventData }) => {
    const router = useRouter()
    const { supabase } = useSupabase()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [falseRequest, setFalseRequest] = useState<boolean>(false)
    const [resultDeclared, setResultDeclared] = useState(false)

    const [templateFile, setTemplateFile] = useState<File | null>(null)
    const [cords, setCords] = useState<number[][]>([
        [-1, -1], // name
        [-1, -1], // class
        [-1, -1], // date
        [-1, -1], // event
        [-1, -1], // position
    ])
    const [templateFontSize, setTemplateFontSize] = useState<number>(20)

    const sendGenerationRequest = async (test: boolean = false) => {
        const path = templateFile
            ? (
                  await supabase.storage
                      .from("templates")
                      .upload(`${event.id}.png`, templateFile, {
                          upsert: true,
                          contentType: "image/png",
                      })
              ).data?.path
            : null

        if (path) {
            const template_url = await supabase.storage
                .from("templates")
                .getPublicUrl(path).data.publicUrl

            const data: RequestFormat = {
                event_id: event.id,
                name_cords: cords[0],
                class_cords: cords[1],
                date_cords: cords[2],
                eventname_cords: cords[3],
                postion_cords: cords[4],
                template_url: template_url,
                fontSize: templateFontSize,
                token: env.NEXT_PUBLIC_REQUEST_TOKEN,
                test: test,
            }
            const response = await axios.post(
                "https://legit9.pythonanywhere.com/certify/generateCertificates/",
                data
            )
            return response.status === 200 ? true : false
        }

        return false
    }

    const handleGenerate = async () => {
        await downloadFile(supabase, event)
        router.push("/")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)
            const requestSuccess = await sendGenerationRequest()
            if (requestSuccess) {
                const { error } = await supabase
                    .from("event")
                    .update({
                        isopen: false,
                    })
                    .eq("id", event.id)
                if (error) {
                    throw new Error(error.message)
                }

                setFalseRequest(false)
                setSuccess(true)
            } else {
                setFalseRequest(true)
            }
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    const handleTest = async () => {
        setLoading(true)
        const requestSuccess = await sendGenerationRequest(true)
        if (requestSuccess) {
            await downloadFile(supabase, event, true)
            supabase.storage.from("certificates").remove([`${event.id}.png`])
        } else {
            toast({
                title: "An error occured while generating test certificate!",
                description:
                    "Please check whether you have added your template...",
                variant: "destructive",
            })
        }
        setLoading(false)
    }

    return resultDeclared ? (
        <div>
            <div className="w-full">
                <h3 className="font-bold mb-5">
                    Please upload and configure your template:
                </h3>
                <TemplateConfigForm
                    cords={cords}
                    setCords={setCords}
                    setTemplateFile={setTemplateFile}
                    event={event}
                    templateFontSize={templateFontSize}
                    setTemplateFontSize={setTemplateFontSize}
                />
            </div>
            <div className="w-full flex flex-wrap justify-between gap-2">
                <Button
                    disabled={loading}
                    onClick={handleTest}
                    variant={"secondary"}
                >
                    {!loading ? (
                        "Generate Test Certificate"
                    ) : (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                </Button>
                <Dialog>
                    <DialogTrigger suppressHydrationWarning asChild>
                        <Button
                            onClick={() => {
                                setFalseRequest(false)
                            }}
                        >
                            End Event and Generate Certificates
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            {!loading ? (
                                !success ? (
                                    <DialogTitle>Are you sure?</DialogTitle>
                                ) : (
                                    <DialogTitle>Event Ended</DialogTitle>
                                )
                            ) : (
                                <DialogTitle>Please wait...</DialogTitle>
                            )}
                            <DialogDescription>
                                {!loading ? (
                                    !success ? (
                                        <p>
                                            Please re-check all your details and
                                            template configuration.
                                        </p>
                                    ) : (
                                        <p>
                                            Certificates will be download as a
                                            zip file.
                                        </p>
                                    )
                                ) : (
                                    <p>You will be redirected shortly.</p>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <Button
                            onClick={!success ? handleSubmit : handleGenerate}
                            disabled={loading}
                            className="w-full"
                        >
                            {!loading ? (
                                !success ? (
                                    <p>Yes, now generate all certificates</p>
                                ) : (
                                    <p>Download</p>
                                )
                            ) : (
                                <p className="animate-pulse flex ">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating
                                </p>
                            )}
                        </Button>
                        {falseRequest && (
                            <Alert className=" my-5 w-[100%]">
                                <AlertTitle className="flex text-red-500">
                                    Bad Configuration !
                                </AlertTitle>
                                <AlertDescription>
                                    Please setup a proper template
                                    configuration.
                                </AlertDescription>
                            </Alert>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    ) : (
        <div className="space-y-8 w-full flex justify-end">
            <Button
                onClick={() => setResultDeclared(true)}
                disabled={loading === !success}
                variant={"secondary"}
            >
                Configure Template <ArrowBottomRightIcon className="ml-2" />
            </Button>

            {error ? (
                <p className="mt-8 text-xs text-red-500">{error}</p>
            ) : (
                <></>
            )}
        </div>
    )
}
