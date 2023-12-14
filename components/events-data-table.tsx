"use client"

import React from "react"
import Link from "next/link"
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
import {
    CheckCircle2,
    DatabaseZap,
    DownloadCloud,
    Hourglass,
    XCircle,
} from "lucide-react"

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCertificates } from "@/components/utils"
import { useSupabase } from "@/app/supabase-provider"

export type EventTableData = {
    branchwise: boolean
    date: string | null
    description: string | null
    id: string
    isopen: boolean | null
    name: string | null
    team_limit: number
}

export const columns: ColumnDef<EventTableData>[] = [
    {
        accessorKey: "name",
        header: "Event Name",
    },
    {
        id: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <p className="text-muted-foreground">
                    {row.original.description}
                </p>
            )
        },
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            return row.original.isopen ? (
                <span className="flex items-center text-muted-foreground">
                    <Hourglass className="mr-2 h-4 w-4" /> Open
                </span>
            ) : (
                <span className="flex items-center text-muted-foreground">
                    <XCircle className="mr-2 h-4 w-4" /> Closed
                </span>
            )
        },
    },
    {
        id: "branchwise",
        header: "Branchwise?",
        cell: ({ row }) => {
            return row.original.branchwise ? (
                <CheckCircle2 className="text-muted-foreground ml-2 h-4 w-4" />
            ) : (
                <XCircle className="text-muted-foreground ml-2 h-4 w-4" />
            )
        },
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            return (
                <Button variant={"secondary"} asChild>
                    <Link href={`/admin/event/${row.original.id}`}>
                        Manage <DatabaseZap className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            )
        },
    },
    {
        id: "download_certificates",
        header: "Certificates",
        cell: ({ row }) => {
            const { toast } = useToast()
            const { supabase } = useSupabase()

            const handleCerts = async () => {
                const certs = await downloadCertificates(supabase, row.original)

                if (!certs) {
                    return toast({
                        title: "Error fetching certificates",
                        description:
                            "Try again later or regenerate all certificates for the specified event.",
                    })
                }
            }

            return (
                <>
                    <Button
                        onClick={handleCerts}
                        variant={"default"}
                        disabled={row.original.isopen ?? false}
                    >
                        Downlaod <DownloadCloud className="ml-2 h-4 w-4" />
                    </Button>
                </>
            )
        },
    },
]

interface EventsTableProps {
    data: EventTableData[]
}

export const EventDataTable = ({ data }: EventsTableProps) => {
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

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Events..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
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
