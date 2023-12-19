import { SupabaseClient } from "@supabase/supabase-js"

import type { EventData } from "@/components/event-card"

export const downloadFile = async (
    supabaseContext: SupabaseClient,
    event: EventData,
    test: boolean = false,
    excelsheet: boolean = false
) => {
    let data: Blob | null = null
    if (!excelsheet) {
        const { data: cert, error } = await supabaseContext.storage
            .from("certificates")
            .download(`${event.id}.${test ? "png" : "zip"}`)
        if (error) {
            console.log(error.message)
            return false
        }
        data = cert
    } else {
        const { data: sheet, error } = await supabaseContext.storage
            .from("sheets")
            .download(`${event.id}.xls`)
        if (error) {
            console.log(error.message)
            return false
        }
        data = sheet
        await supabaseContext.storage.from("sheets").remove([`${event.id}.xls`])
    }

    if (data) {
        const blob =
            test || excelsheet
                ? data
                : data.slice(0, data.size, "application/zip")
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.download = `${event.name}-${event.date}`

        document.body.appendChild(link)
        link.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            })
        )

        document.body.removeChild(link)
    }

    return true
}
