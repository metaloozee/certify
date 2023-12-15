"use client"

import { MessageCircle, MessageCirclePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/app/supabase-provider"

const MessageTrigger = ({
    isLatestMessageOpened,
}: {
    isLatestMessageOpened: boolean
}) => {
    const { supabase } = useSupabase()
    const handleOpen = async () => {
        const { error } = await supabase
            .from("messages")
            .update({
                opened: true,
            })
            .eq("opened", false)

        if (error) {
            return toast({
                title: "Error occur while setting messages to read.",
            })
        }
    }

    return (
        <Button
            suppressHydrationWarning
            className="rounded-full"
            variant={"outline"}
            size={"icon"}
            onClick={handleOpen}
        >
            {isLatestMessageOpened ? (
                <MessageCircle className="w-5 h-5" />
            ) : (
                <MessageCirclePlus className="w-5 h-5 animate-pulse" />
            )}
        </Button>
    )
}

export default MessageTrigger
