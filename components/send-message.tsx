"use client"

import { useState } from "react"
import { Session } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/app/supabase-provider"

const SendMessage = ({ session }: { session: Session | null }) => {
    const { supabase } = useSupabase()

    const [message, setMessage] = useState<string>("")
    const sendMessage = () => {
        supabase
            .from("messages")
            .insert({
                from: session?.user.id,
                content: message,
            })
            .then((res) => {
                toast({
                    title: "Message sent successfully!",
                    description:
                        "Admin will look up your message and contact you.",
                })
                setMessage("")
            })
    }

    const handleSubmit = () => {
        if (session) {
            supabase
                .from("messages")
                .select("created_at")
                .eq("from", session.user.id)
                .order("created_at")
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        const latest_message: any = new Date(
                            res.data?.reverse()[0].created_at ?? ""
                        )
                        const current: any = new Date()
                        const interval =
                            (current - latest_message) / (1000 * 60 * 60)

                        if (interval < 3) {
                            return toast({
                                title: "Timeout!",
                                description:
                                    "You can only send a message once every 3 hours...",
                            })
                        }
                    }

                    sendMessage()
                })
        } else {
            return toast({
                title: "Please login first...",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex gap-2 mt-2">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please remove me from Solo quiz competition..."
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}

export default SendMessage
