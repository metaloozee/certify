"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Edit, RocketIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { EventData } from "@/components/event-card"
import { useSupabase } from "@/app/supabase-provider"

export const EditEventDialog = ({ event }: { event: EventData }) => {
    const [loading, setLoading] = useState(false)
    const [eventName, setEventName] = useState<string | null>(event.name)
    const [eventDescription, setEventDescription] = useState<string | null>(
        event.description
    )
    const [startDate, setStartDate] = useState<Date | undefined>(
        new Date(event.date ?? Date.now())
    )

    const { supabase } = useSupabase()
    const router = useRouter()
    const handleSubmit = () => {
        if (
            eventName &&
            eventName.length > 0 &&
            eventName.trim() !== "" &&
            eventDescription &&
            eventDescription.length > 0 &&
            eventDescription.trim() !== "" &&
            startDate
        ) {
            setLoading(true)
            try {
                supabase
                    .from("event")
                    .update({
                        date: startDate.toDateString(),
                        name: eventName,
                        description: eventDescription,
                    })
                    .eq("id", event.id)
                    .then(() => {
                        toast({ title: "Changes applied successfully!" })
                        router.refresh()
                    })
            } catch {
                return toast({
                    title: "An error occured while editing this event!",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        } else {
            return toast({
                title: "Please fill the fields appropriately!",
            })
        }
    }
    return (
        <Dialog>
            <DialogTrigger suppressHydrationWarning asChild>
                <Button variant={"outline"}>
                    <Edit className="w-4 h-4 text-yellow-500" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="space-y-7">
                    <div className="">
                        <div className="w-full space-y-2">
                            <Label>Name</Label>
                            <Input
                                type="text"
                                value={eventName ?? ""}
                                onChange={(e) => setEventName(e.target.value)}
                                disabled={loading}
                                className="w-full"
                            />
                        </div>
                        <br />
                        <div className="w-full space-y-2">
                            <Label>Description</Label>
                            <Input
                                type="text"
                                value={eventDescription ?? ""}
                                onChange={(e) =>
                                    setEventDescription(e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full space-y-2">
                            <Label>Start Date</Label>
                            <br />

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !startDate &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        {startDate ? (
                                            format(startDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(e) => setStartDate(e)}
                                        className="rounded-md border"
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Button
                        disabled={loading}
                        className="w-full"
                        onClick={handleSubmit}
                    >
                        Confirm Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
