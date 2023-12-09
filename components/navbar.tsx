import Link from "next/link"

import { AdminMessages } from "@/components/admin-messages"
import { ModeToggle } from "@/components/toggle-mode"
import { UserAccount } from "@/components/user-btn"
import { createServerSupabaseClient } from "@/app/supabase-server"

export const Navbar = async () => {
    const supabase = createServerSupabaseClient()
    const { data: user } = await supabase.auth.getUser()
    const { data: id } = await supabase
        .from("admin")
        .select("*")
        .eq("id", user.user?.id ?? "")
        .single()

    return user ? (
        <header className="top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">Certify</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end">
                    <nav className="flex items-center justify-center gap-5">
                        {id && <AdminMessages />}
                        <ModeToggle />
                        <UserAccount user={user.user} />
                    </nav>
                </div>
            </div>
        </header>
    ) : (
        <header className="top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">Certify</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end">
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
