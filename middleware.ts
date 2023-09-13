import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const session = await supabase.auth.getSession()
    if (session.data.session !== null) {
        const user = session.data.session.user
        console.log(user)
        // if (req.nextUrl.pathname.startsWith("/_next")) {
        //     return NextResponse.next()
        // }
        // if (req.nextUrl.pathname.startsWith("/?code")) {
        //     return NextResponse.next()
        // }
        console.log(req.url)
        const { data, error } = await supabase
            .from("student")
            .select("*")
            .eq("id", user.id)
        if (error) {
            throw error
        }
        console.log(data.length > 0)
        console.log(data)
        if (data.length > 0) {
            console.log("existing.. ")
        } else {
            return NextResponse.redirect(new URL("/welcome", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/"],
}
