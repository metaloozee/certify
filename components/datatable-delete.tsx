import { useRouter } from "next/navigation"
import { Row } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"

import { useSupabase } from "@/app/supabase-provider"

import { EventParticipantData } from "./member-data-table"
import { Button } from "./ui/button"
import { toast } from "./ui/use-toast"

export const DataTableDelete = ({
    row,
}: {
    row: Row<EventParticipantData>
}) => {
    const router = useRouter()
    const { supabase } = useSupabase()

    return (
        <Button
            onClick={async () => {
                try {
                    const { error } = await supabase
                        .from("group")
                        .delete()
                        .eq("id", row.original.group?.id ?? "")

                    if (error) {
                        throw new Error(error.message)
                    }

                    await router.refresh()

                    return toast({
                        title: "Data Deleted!",
                        description: `Successfully deleted the group.`,
                    })
                } catch (e: any) {
                    console.error(e)
                    toast({
                        title: "Uh Oh!",
                        description: `You cannot delete a group which has already been alloted a position, change back its position to participant to do so.`,
                    })
                }
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
}
