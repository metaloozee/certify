import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res })

    async function checkIfIdExistsInTable(
        tableName: string,
        idToCheck: string
    ): Promise<boolean> {
        const { data, error } = await supabase
            .from(tableName)
            .select("*")
            .eq("id", idToCheck)

        if (error) {
            throw error
        }

        // Check if any rows were returned
        return data.length > 0
    }

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const session = await supabase.auth.getSession()
    if (session.data.session !== null) {
        const user = session.data.session.user

        checkIfIdExistsInTable("student", user.id)
            .then((exists) => {
                if (exists) {
                    console.log(`already registered`)
                } else {
                    const { pathname } = req.nextUrl

                    if (pathname.startsWith("/_next"))
                        return NextResponse.next()

                    req.nextUrl.pathname = "/welcome"
                    return NextResponse.redirect(req.nextUrl)
                }
            })
            .catch((error) => {
                console.error("Error checking ID:", error)
            })
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/welcome",
}
