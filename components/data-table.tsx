"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontal, Save, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/app/supabase-provider"

export type EventParticipantData = {
    id: string
    event_id: string | null
    group: {
        id: string
        name: string | null
        groupmember: {
            student: {
                class: string | null
                enrollment: string | null
                first_name: string | null
                id: string
                last_name: string | null
            } | null
        }[]
    } | null
    branch: string
}

export const columns: ColumnDef<EventParticipantData>[] = [
    {
        accessorKey: "group.name",
        header: "Group Name",
    },
    {
        accessorKey: "group.groupmember",
        header: "Group Members",
        cell: ({ row }) => {
            const members = row.original.group?.groupmember || []
            return (
                <div className="space-y-2">
                    {members.map((member, index) => (
                        <div key={index}>
                            {`${member.student?.first_name} ${member.student?.last_name}`}
                        </div>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "group.groupmember",
        header: "Enrollment No",
        cell: ({ row }) => {
            const members = row.original.group?.groupmember || []
            return (
                <div className="space-y-2">
                    {members.map((member, index) => (
                        <div key={index}>{member.student?.enrollment}</div>
                    ))}
                </div>
            )
        },
    },
    {
        id: "result",
        header: "Result",
        cell: ({ row }) => {
            const { toast } = useToast()
            const { supabase } = useSupabase()

            const [position, setPosition] = useState<string>("participant")
            const [loading, setLoading] = useState(false)

            const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()
                const id = row.original.event_id
                const branchCode =
                    row.original.group?.groupmember[0]?.student?.class?.slice(
                        -2
                    )
                var element
                try {
                    setLoading(true)
                    const { data: eData } = await supabase
                        .from("eventresult")
                        .select("winner, runner_up, second_runner_up")
                        .eq("branch", branchCode)
                    console.log(eData)
                    if (
                        eData !== null &&
                        eData !== undefined &&
                        eData.length > 0
                    ) {
                        for (let i = 0; i < eData.length; i++) {
                            element = eData[i]
                        }
                    }
                    if (position === "winner") {
                        if (
                            element?.winner == null ||
                            element.winner == undefined
                        ) {
                            if (
                                element?.second_runner_up ==
                                    row.original.group?.id ||
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
                                    .insert({
                                        event_id: id,
                                        winner: row.original.group?.id,
                                        branch: branchCode,
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
                                element?.second_runner_up ==
                                    row.original.group?.id ||
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
                                    .insert({
                                        event_id: id,
                                        runner_up: row.original.group?.id,
                                        branch: branchCode,
                                    })
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
                                element?.second_runner_up ==
                                    row.original.group?.id
                            ) {
                                return toast({
                                    title: "uh oh!",
                                    description: `Cant select Multiple 'Second Runner ups' from same branch`,
                                })
                            } else {
                                const { error } = await supabase
                                    .from("eventresult")
                                    .insert({
                                        event_id: id,
                                        second_runner_up:
                                            row.original.group?.id,
                                        branch: branchCode,
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
                        console.log(element?.winner)
                        for (let i = 0; i < eData!.length; i++) {
                            element = eData![i]
                        }
                        if (element?.winner === row.original.group?.id) {
                            const { error } = await supabase
                                .from("eventresult")
                                .delete()
                                .eq("winner", row.original.group?.id ?? "")

                            if (error) {
                                throw new Error(error.message)
                            }
                        } else if (
                            element?.runner_up === row.original.group?.id
                        ) {
                            const { error } = await supabase
                                .from("eventresult")
                                .delete()
                                .eq("runner_up", row.original.group?.id ?? "")

                            if (error) {
                                throw new Error(error.message)
                            }
                        } else if (
                            element?.second_runner_up === row.original.group?.id
                        ) {
                            const { error } = await supabase
                                .from("eventresult")
                                .delete()
                                .eq(
                                    "second_runner_up",
                                    row.original.group?.id ?? ""
                                )

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
                    <Select
                        onValueChange={(e) => setPosition(e as string)}
                        defaultValue={position}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={position} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Position</SelectLabel>
                                <SelectItem value="winner">Winner</SelectItem>
                                <SelectItem value="runnerup">
                                    Runner Up
                                </SelectItem>
                                <SelectItem value="secondrunnerup">
                                    Second Runner Up
                                </SelectItem>
                                <SelectItem value="participant">
                                    Participant
                                </SelectItem>
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
        },
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            const router = useRouter()
            const { supabase } = useSupabase()

            return (
                <Button
                    onClick={async () => {
                        await supabase
                            .from("group")
                            .delete()
                            .eq("id", row.original.group?.id ?? "")
                        await router.refresh()
                    }}
                    size={"sm"}
                    variant={"ghost"}
                >
                    <TrashIcon className="text-red-500 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Branch",
        header: "Branch",
        cell: ({ row }) => {
            const members = row.original.group?.groupmember || []
            return (
                <div className="space-y-2">
                    {members.map((member, index) => (
                        <div key={index}>
                            {row.original.group?.groupmember[0]?.student?.class?.slice(
                                -2
                            )}
                        </div>
                    ))}
                </div>
            )
        },
    },
]

interface DataTableProps {
    data: EventParticipantData[]
}

export const DataTable = ({ data }: DataTableProps) => {
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            columnVisibility,
        },
    })
    const [selectedPositions, setSelectedPositions] = useState<
        Record<string, string>
    >({})

    const updateSelectedPosition = (branch: string, position: string) => {
        setSelectedPositions((prevSelected) => ({
            ...prevSelected,
            [branch]: position,
        }))
    }

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Members..."
                    value={
                        (table
                            .getColumn("group_name")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("group_name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
