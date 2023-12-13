"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Session } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/app/supabase-provider"

const SendMessage = ({
    session,
    enrollment,
}: {
    session: Session | null
    enrollment: string | null
}) => {
    const { supabase } = useSupabase()
    const router = useRouter()

    const [message, setMessage] = useState<string | null>(null)
    const sendMessage = () => {
        supabase
            .from("messages")
            .insert({
                from: session?.user.id,
                content: message,
            })
            .then(() => {
                toast({
                    title: "Message sent successfully!",
                    description:
                        "Admin will look up your message and contact you.",
                })
                setMessage(null)
            })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (session && enrollment) {
                await supabase
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
                    title: "Please login or setup your account first...",
                    variant: "destructive",
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            router.refresh()
        }
    }

    return (
        <div className="flex gap-2 mt-2">
            <Input
                value={message ?? ""}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please remove me from Solo quiz competition..."
            />
            <Button
                disabled={message && message.trim().length > 0 ? false : true}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
    )
}

export default SendMessage
