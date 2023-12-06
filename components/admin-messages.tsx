import { MessageCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import DeleteMessageButton from "@/components/delete-message"
import { createServerSupabaseClient } from "@/app/supabase-server"

export interface Message {
    id: string
    created_at: string
    content: string | null
    student: {
        first_name: string | null
        last_name: string | null
        enrollment: string | null
        class: string | null
    } | null
}

const AdminMessages = async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.from("messages").select(`
    id,
    created_at,
    content,
    student (
        first_name,
        last_name,
        enrollment,
        class
    )
    `)

    return data && data.length > 0 ? (
        <Sheet>
            <SheetTrigger>
                <MessageCircleIcon />
            </SheetTrigger>
            <SheetContent className="overflow-auto">
                <SheetHeader>
                    <SheetTitle>Messages</SheetTitle>
                </SheetHeader>

                {data.map((message) => (
                    <Card className="w-full  flex flex-col justify-between my-5">
                        <CardHeader>
                            <CardTitle className="flex items-center w-full">
                                {message.student?.first_name}{" "}
                                {message.student?.last_name}
                            </CardTitle>
                            <div className="flex">
                                <Badge className="mr-2" variant={"outline"}>
                                    {message.student?.class}
                                </Badge>
                                <Badge variant={"outline"}>
                                    {message.created_at.split("T")[0]}
                                </Badge>
                                <DeleteMessageButton message={message} />
                            </div>
                            <CardDescription>{message.content}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </SheetContent>
        </Sheet>
    ) : (
        <h1>No new messages</h1>
    )
}

export default AdminMessages
