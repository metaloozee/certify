import { SupabaseClient } from "@supabase/supabase-js"

import type { EventData } from "@/components/event-card"

export const downloadCertificates = async (
    supabaseContext: SupabaseClient,
    event: EventData,
    test: boolean = false
) => {
    console.log("Downloading Certificates!")
    const { data, error } = await supabaseContext.storage
        .from("certificates")
        .download(`${event.id}.${test ? "png" : "zip"}`)

    if (data) {
        const blob = test ? data : data.slice(0, data.size, "application/zip")
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

    if (error) {
        console.log(error.message)
        return false
    }
    return true
}
