import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (session) {
        const user = session.user
        const { data: studentData, error: studentError } = await supabase
            .from("student")
            .select("enrollment")
            .eq("id", user.id)
            .single()

        if (studentError) {
            throw new Error(studentError.message)
        }

        if (!studentData || studentData.enrollment === null) {
            return NextResponse.redirect(new URL("/welcome", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/"],
}
