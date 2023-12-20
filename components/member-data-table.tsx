"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTableDelete } from "@/components/datatable-delete"
import { DataTableResult } from "@/components/datatable-result"
import { GenerateExcelButton } from "@/components/generate-excel"

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
                contact_number: string | null
            } | null
        }[]
    } | null
}

export const columns: ColumnDef<EventParticipantData>[] = [
    {
        id: "group_name",
        accessorKey: "group.name",
        header: "Group Name",
    },
    {
        id: "group_member_name",
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
        id: "enrollment",
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
        id: "branch",
        accessorKey: "branch",
        header: "Branch",
        cell: ({ row }) => {
            return (
                <div className="space-y-2">
                    {row.original.group?.groupmember.map((member, index) => (
                        <div key={index}>{member.student?.class}</div>
                    ))}
                </div>
            )
        },
    },
    {
        id: "contactNumber",
        accessorKey: "group.groupmember",
        header: "Contact Number",
        cell: ({ row }) => {
            const members = row.original.group?.groupmember || []
            return (
                <div className="space-y-2">
                    {members.map((member, index) => (
                        <div key={index}>{member.student?.contact_number}</div>
                    ))}
                </div>
            )
        },
    },
    {
        id: "result",
        header: "Result",
        cell: ({ row }) => {
            return <DataTableResult row={row} />
        },
    },

    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            return <DataTableDelete row={row} />
        },
    },
]

export const MemberDataTable = ({ data }: { data: EventParticipantData[] }) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Groups"
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
                <div className="ml-auto">
                    <GenerateExcelButton data={data[0]} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                <div className="space-x-2">
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
        </div>
    )
}
