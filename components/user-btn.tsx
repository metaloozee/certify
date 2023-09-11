"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    createClientComponentClient,
    Session,
} from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const UserAccount = ({ session }: { session: Session | null }) => {
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: "google" })
        router.refresh()
    }

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return session ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar>
                        <AvatarImage
                            src={session.user.user_metadata.avatar_url ?? ""}
                        />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {session.user.user_metadata.full_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link className="text-center w-full" href={"/account"}>
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button
                            onClick={handleLogOut}
                            variant={"destructive"}
                            className="w-full"
                        >
                            Log Out
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button onClick={handleLogin}>Login</Button>
    )
}
