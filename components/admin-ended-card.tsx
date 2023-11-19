"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { EventData } from "@/components/event-card"
import { downloadCertificates } from "@/components/utils"
import { useSupabase } from "@/app/supabase-provider"

export const AdminEndedEventCard = ({ data }: { data: EventData }) => {
    const { supabase } = useSupabase()
    const [success, setSuccess] = useState<boolean>(true)

    return (
        <Card className="w-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Badge>MAX MEMBERS: {data.team_limit}</Badge>
                <p className="text-sm text-green-500">
                    {new Date(data.date ?? "").toDateString()}
                </p>
            </CardContent>
            <CardFooter>
                <Link className="w-full mr-2" href={`/admin/event/${data.id}`}>
                    <Button className="w-full">Manage Event</Button>
                </Link>
                <Button
                    className="w-full ml-2"
                    onClick={async () => {
                        setSuccess(await downloadCertificates(supabase, data))
                    }}
                >
                    Download Certificates
                </Button>
            </CardFooter>
            {!success && (
                <Alert variant="destructive" className="text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error fetching certificates</AlertTitle>
                    <AlertDescription>
                        Try again later or manage event and regenerate all
                        certificates.
                    </AlertDescription>
                </Alert>
            )}
        </Card>
    )
}
