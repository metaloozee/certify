import { useEffect, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { Save } from "lucide-react"

import { useSupabase } from "@/app/supabase-provider"

import { EventParticipantData } from "./member-data-table"
import { Button } from "./ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { toast } from "./ui/use-toast"

export const DataTableResult = ({
    row,
}: {
    row: Row<EventParticipantData>
}) => {
    const { supabase } = useSupabase()

    const [defaultPosition, setDefaultPosition] =
        useState<string>("Participant")
    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const { data, error } = await supabase
                    .from("eventresult")
                    .select("*")
                    .eq("event_id", row.original.event_id ?? "")
                    .eq(
                        "branch",
                        row.original.group?.groupmember[0].student?.class?.slice(
                            -2
                        ) ?? ""
                    )
                    .maybeSingle()

                if (error) {
                    throw new Error(error.message)
                }

                if (data?.winner == row.original.group?.id) {
                    return setDefaultPosition("Winner")
                } else if (data?.runner_up == row.original.group?.id) {
                    return setDefaultPosition("Runner Up")
                } else if (data?.second_runner_up == row.original.group?.id) {
                    return setDefaultPosition("Second Runner Up")
                } else {
                    return setDefaultPosition("Participant")
                }
            } catch (error) {
                console.error("Error fetching position:", error)
                setDefaultPosition("participant")
            }
        }

        fetchPosition()
    }, [])

    const [position, setPosition] = useState<string>("participant")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const id = row.original.event_id
        const branchCode =
            row.original.group?.groupmember[0]?.student?.class?.slice(-2)
        var element
        try {
            setLoading(true)
            const { data: eData } = await supabase
                .from("eventresult")
                .select("id, winner, runner_up, second_runner_up")
                .eq("branch", branchCode ?? "")
                .eq("event_id", id ?? "")

            if (eData !== null && eData !== undefined && eData.length > 0) {
                for (let i = 0; i < eData.length; i++) {
                    element = eData[i]
                }
            }
            if (position === "winner") {
                if (element?.winner == null || element.winner == undefined) {
                    if (
                        element?.second_runner_up == row.original.group?.id ||
                        element?.runner_up == row.original.group?.id ||
                        element?.winner == row.original.group?.id
                    ) {
                        return toast({
                            title: "uh oh!",
                            description: `Cant select Multiple 'winners' from same branch`,
                        })
                    } else {
                        const { error } = await supabase
                            .from("eventresult")
                            .upsert({
                                id: element?.id,
                                event_id: id,
                                winner: row.original.group?.id,
                                branch: branchCode ?? "",
                            })
                        if (error) {
                            throw new Error(error.message)
                        }
                    }
                } else {
                    return toast({
                        title: "uh oh!",
                        description: `Cant select Multiple 'winners' from same branch`,
                    })
                }
            } else if (position === "runnerup") {
                if (
                    element?.runner_up == null ||
                    element.runner_up == undefined
                ) {
                    if (
                        element?.second_runner_up == row.original.group?.id ||
                        element?.winner == row.original.group?.id ||
                        element?.runner_up == row.original.group?.id
                    ) {
                        return toast({
                            title: "uh oh!",
                            description: `Cant select Multiple 'Runner ups' from same branch`,
                        })
                    } else {
                        const { error } = await supabase
                            .from("eventresult")
                            .upsert({
                                id: element?.id,
                                event_id: id,
                                runner_up: row.original.group?.id,
                                branch: branchCode ?? "",
                            })
                            .eq("event_id", id ?? "")
                        if (error) {
                            throw new Error(error.message)
                        }
                    }
                } else {
                    return toast({
                        title: "uh oh!",
                        description: `Cant select Multiple 'Runner ups' from same branch`,
                    })
                }
            } else if (position === "secondrunnerup") {
                for (let i = 0; i < eData!.length; i++) {
                    element = eData![i]
                }
                if (
                    element?.second_runner_up == null ||
                    element.second_runner_up == undefined
                ) {
                    if (
                        element?.runner_up == row.original.group?.id ||
                        element?.winner == row.original.group?.id ||
                        element?.second_runner_up == row.original.group?.id
                    ) {
                        return toast({
                            title: "uh oh!",
                            description: `Cant select Multiple 'Second Runner ups' from same branch`,
                        })
                    } else {
                        const { error } = await supabase
                            .from("eventresult")
                            .upsert({
                                id: element?.id,
                                event_id: id,
                                second_runner_up: row.original.group?.id,
                                branch: branchCode ?? "",
                            })

                        if (error) {
                            throw new Error(error.message)
                        }
                    }
                } else {
                    return toast({
                        title: "uh oh!",
                        description: `Cant select Multiple ' Second Runner ups' from same branch`,
                    })
                }
            } else if (position === "participant") {
                for (let i = 0; i < eData!.length; i++) {
                    element = eData![i]
                }
                if (element?.winner === row.original.group?.id) {
                    const { error } = await supabase
                        .from("eventresult")
                        .upsert({
                            id: element?.id,
                            event_id: id,
                            winner: null,
                            branch: branchCode ?? "",
                        })

                    if (error) {
                        throw new Error(error.message)
                    }
                } else if (element?.runner_up === row.original.group?.id) {
                    const { error } = await supabase
                        .from("eventresult")
                        .upsert({
                            id: element?.id,
                            event_id: id,
                            runner_up: null,
                            branch: branchCode ?? "",
                        })

                    if (error) {
                        throw new Error(error.message)
                    }
                } else if (
                    element?.second_runner_up === row.original.group?.id
                ) {
                    const { error } = await supabase
                        .from("eventresult")
                        .upsert({
                            id: element?.id,
                            event_id: id,
                            second_runner_up: null,
                            branch: branchCode ?? "",
                        })

                    if (error) {
                        throw new Error(error.message)
                    }
                }
            }

            return toast({
                title: "Data Updated!",
                description: `Successfully updated the group's position as ${position}`,
            })
        } catch (e: any) {
            console.error(e)
            toast({
                title: "Uh Oh!",
                description: `An unknown error occurred!`,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="flex flex-row gap-2" onSubmit={handleSubmit}>
            <Select onValueChange={(e) => setPosition(e as string)}>
                <SelectTrigger>
                    <SelectValue placeholder={defaultPosition} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Position</SelectLabel>
                        <SelectItem value="winner">Winner</SelectItem>
                        <SelectItem value="runnerup">Runner Up</SelectItem>
                        <SelectItem value="secondrunnerup">
                            Second Runner Up
                        </SelectItem>
                        <SelectItem value="participant">Participant</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {loading ? (
                <Button disabled type="submit" variant={"ghost"}>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                </Button>
            ) : (
                <Button type="submit" variant={"ghost"}>
                    <Save className="text-green-500 h-4 w-4" />
                </Button>
            )}
        </form>
    )
}
