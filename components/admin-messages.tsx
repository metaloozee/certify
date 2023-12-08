import { MessageCircleIcon } from "lucide-react"

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
            <SheetTrigger asChild suppressHydrationWarning>
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
                    <Card key={index} className="w-full my-5">
                        <CardHeader>
                            <CardDescription
                                suppressHydrationWarning
                                className="grid grid-row-2 content-between gap-5"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex row gap-2">
                                            <h1 className="font-medium text-foreground">
                                                {message.student?.first_name}{" "}
                                                {message.student?.last_name}
                                            </h1>
                                            <Badge variant={"outline"}>
                                                <p className="text-xs font-light text-muted-foreground">
                                                    {
                                                        message.student
                                                            ?.enrollment
                                                    }
                                                </p>
                                            </Badge>
                                        </div>
                                        <DeleteMessageButton
                                            message={message}
                                        />
                                    </div>
                                    <p>{message.content}</p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <p className="text-muted-foreground/50 text-xs">
                                {new Date(message.created_at)
                                    .toUTCString()
                                    .slice(0, 17)}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </SheetContent>
        </Sheet>
    ) : (
        <></>
    )
}
