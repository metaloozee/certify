import { MessageCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
import { DeleteMessageButton } from "@/components/delete-message"
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

export const AdminMessages = async () => {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.from("messages").select(`
    id,
    created_at,
    content,
    student (
        first_name,
        last_name,
        enrollment,
        class,
        id
    )
    `)

    return data && data.length > 0 ? (
        <Sheet>
            <SheetTrigger>
                <Button
                    suppressHydrationWarning
                    className="rounded-full"
                    variant={"outline"}
                    size={"icon"}
                >
                    <MessageCircleIcon className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-auto">
                <SheetHeader>
                    <SheetTitle>Messages</SheetTitle>
                </SheetHeader>

                {data.map((message, index) => (
                    <Card
                        key={index}
                        className="w-full flex flex-col justify-between my-5"
                    >
                        <CardHeader>
                            <CardDescription
                                suppressHydrationWarning
                                className="flex flex-wrap flex-row justify-between gap-5"
                            >
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <h1 className="font-medium text-foreground">
                                            {message.student?.first_name}{" "}
                                            {message.student?.last_name}
                                        </h1>
                                        <Badge variant={"outline"}>
                                            <p className="text-xs font-light text-muted-foreground">
                                                {message.student?.enrollment}
                                            </p>
                                        </Badge>
                                    </div>
                                    <p>{message.content}</p>
                                </div>
                                <DeleteMessageButton message={message} />
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </SheetContent>
        </Sheet>
    ) : (
        <></>
    )
}
