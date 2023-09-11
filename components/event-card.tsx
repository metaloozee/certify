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
    description: string | null
    date: string | null
    isopen: boolean | null
    team_limit: number
}

export const EventCard = async ({ data }: { data: EventData }) => {
    let eventDate = new Date(data.date ?? "")
    let now = new Date()
    let timeRemaining = eventDate.getTime() - now.getTime()

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Badge>MAX MEMBERS: {data.team_limit}</Badge>
                <p className="text-sm text-green-500">
                    {`Starts in: ${days} days, ${hours} hours` ?? "loading.."}
                </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Register</Button>
            </CardFooter>
        </Card>
    )
}
