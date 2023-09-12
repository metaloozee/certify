"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
    createClientComponentClient,
    Session,
} from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import * as z from "zod"

import { Database } from "@/types/supabase"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Button } from "./ui/button"

export type User = {
    enrollment: string | null
}

export type Event = {
    date: string | null
    description: string | null
    id: string
    isopen: boolean | null
    name: string | null
    team_limit: number
}

const formSchema = z.object({
    team_name: z.string(),
    team_member_1_enrollment: z.string(),
    team_member_2_enrollment: z.string(),
    team_member_3_enrollment: z.string(),
    team_member_4_enrollment: z.string(),
    team_member_5_enrollment: z.string(),
    team_member_6_enrollment: z.string(),
})

export const EventForm = ({
    session,
    event,
    user,
}: {
    session: Session | null
    event: Event
    user: User
}) => {
    const [random_team_name, setRandom_team_name] = useState<string>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const name: string = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors],
            length: 2,
        })

        setRandom_team_name(name)
    }, [])

    const supabase = createClientComponentClient<Database>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            team_name: random_team_name,
            team_member_1_enrollment: user.enrollment ?? "",
        },
    })

    const handleForm = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        console.log(values.team_name)
        alert("yo")
    }

    const teamMemberFields: string[] = []
    for (let i = 0; i < event.team_limit; i++) {
        teamMemberFields.push(`team_member_${i + 1}_enrollment`)
    }

    return (
        <div className="mt-10 container max-w-lg">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleForm)}
                    className="w-full space-y-8"
                >
                    {teamMemberFields.map((fieldName, index) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as keyof z.infer<typeof formSchema>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{`Team Member ${
                                        index + 1
                                    }'s Enrollment Number`}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    {!loading ? (
                        <Button className="w-full" type="submit">
                            Register for {event.name}
                        </Button>
                    ) : (
                        <Button className="min-w-fit" disabled type="submit">
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    )
}
