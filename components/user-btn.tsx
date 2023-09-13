"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/auth-helpers-nextjs"
import { UserCircleIcon } from "lucide-react"

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
import { useSupabase } from "@/app/supabase-provider"

export const UserAccount = ({ user }: { user: User | null }) => {
    const router = useRouter()
    const { supabase } = useSupabase()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: "google" })
        router.refresh()
    }

    const handleLogOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar>
                        <AvatarImage src={user.user_metadata.avatar_url} />
                        <AvatarFallback>
                            <UserCircleIcon />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.user_metadata.full_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
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
