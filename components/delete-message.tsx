"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Message } from "@/components/admin-messages"
import { useSupabase } from "@/app/supabase-provider"

export const DeleteMessageButton = ({ message }: { message: Message }) => {
    const { supabase } = useSupabase()
    const router = useRouter()
    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from("messages")
                .delete()
                .eq("id", message.id ?? "")
            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e.message)
        } finally {
            router.refresh()
            toast({
                title: "The message was deleted",
            })
        }
    }
    return (
        <Button
            variant={"outline"}
            onClick={handleDelete}
            className="rounded-full"
            size={"icon"}
        >
            <TrashIcon className="text-red-500 h-4 w-4 float-right" />
        </Button>
    )
}
