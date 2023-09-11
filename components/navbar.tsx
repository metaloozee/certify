"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    createClientComponentClient,
    createServerComponentClient,
    Session,
} from "@supabase/auth-helpers-nextjs"

import { UserAccount } from "./user-btn"

export const Navbar = () => {
    const supabase = createClientComponentClient()

    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        const fetchSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setSession(session)
        }

        fetchSession()
    }, [setSession])

    return (
        <header className="top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">Certify</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end">
                    <nav className="flex items-center">
                        <UserAccount session={session} />
                    </nav>
                </div>
            </div>
        </header>
    )
}
