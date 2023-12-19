"use client"

import { useState } from "react"
import { env } from "@/env.mjs"
import axios from "axios"
import { FileDownIcon, Loader2 } from "lucide-react"

import { useSupabase } from "@/app/supabase-provider"

import { EventData } from "./event-card"
import { EventParticipantData } from "./member-data-table"
import { Button } from "./ui/button"
import { toast } from "./ui/use-toast"
import { downloadFile } from "./utils"

export const GenerateExcelButton = ({
    data,
}: {
    data: EventParticipantData
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { supabase } = useSupabase()

    const handleClick = async () => {
        setLoading(true)
        const { data: event } = await supabase
            .from("event")
            .select("*")
            .eq("id", data.event_id ?? "")
            .single()
        const res = await axios.post(
            "https://legit9.pythonanywhere.com/certify/generateExcelSheet/",
            {
                event_id: data.event_id,
                token: env.NEXT_PUBLIC_REQUEST_TOKEN,
            }
        )
        if (res.status !== 200) {
            setLoading(false)
            return toast({
                title: "An error occured while generating excel sheets!",
                variant: "destructive",
            })
        }

        if (event) {
            downloadFile(supabase, event, false, true)
        }

        setLoading(false)
    }
    return (
        <Button
            disabled={loading}
            className="mr-2"
            variant={"outline"}
            onClick={handleClick}
        >
            {loading ? (
                <div className="flex">
                    <p className="animate-pulse">Generating</p>
                    <Loader2 className="animate-spin w-5 h-5 ml-2" />
                </div>
            ) : (
                <div className="flex">
                    <p>Generate Excel File</p>{" "}
                    <FileDownIcon className="w-5 h-5 ml-2" />
                </div>
            )}
        </Button>
    )
}
