import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const session = await supabase.auth.getSession()
    if (session.data.session !== null) {
        const user = session.data.session.user
        const { data: userData, error: userError } = await supabase
            .from("student")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()

        if (userError) {
            throw new Error(userError.message)
        }

        if (userData?.enrollment === null) {
            return NextResponse.redirect(new URL("/welcome", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/"],
}
