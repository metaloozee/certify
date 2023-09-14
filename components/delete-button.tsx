"use client"

import { useRouter } from "next/navigation"
import { TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EventData } from "@/components/event-card"
import { useSupabase } from "@/app/supabase-provider"

export const DeleteButton = ({ event }: { event: EventData }) => {
    const router = useRouter()
    const { supabase } = useSupabase()

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from("event")
                .delete()
                .eq("id", event?.id ?? "")
            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e.message)
        } finally {
            router.push("/admin")
        }
    }

    return (
        <Button onClick={handleDelete} variant={"outline"}>
            <TrashIcon className="text-red-500 h-4 w-4" />
        </Button>
    )
}
