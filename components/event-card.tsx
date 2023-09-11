"use client"

import { useEffect, useState } from "react"
import { MoveRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export type EventData = {
    id: string
    name: string | null
    date: string | null
    isopen: boolean | null
    team_limit: number
}

export const EventCard = ({ data }: { data: EventData }) => {
    const [countdown, setCountdown] = useState<string | null>(null)

    useEffect(() => {
        let eventDate = new Date(data.date ?? "")
        let now = new Date()
        let timeRemaining = eventDate.getTime() - now.getTime()

        const countdownInterval = setInterval(() => {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
            const hours = Math.floor(
                (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            const minutes = Math.floor(
                (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
            )
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval)
                setCountdown("Event has started")
            } else {
                setCountdown(
                    `Starts in: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
                )
            }

            timeRemaining -= 1000
        }, 1000)

        return () => {
            clearInterval(countdownInterval)
        }
    }, [data.date])

    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Badge>MAX MEMBERS: {data.team_limit}</Badge>
                <p className="text-sm text-green-500">
                    {countdown ?? "loading.."}
                </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Register</Button>
            </CardFooter>
        </Card>
    )
}
