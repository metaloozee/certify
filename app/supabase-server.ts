import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"

export const createServerSupabaseClient = cache(() =>
    createServerComponentClient<Database>({ cookies })
)

export const getSession = async () => {
    const supabase = createServerSupabaseClient()

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession()
        return session
    } catch (e) {
        console.error(e)
        return null
    }
}

export const getCurrentUserDetails = async () => {
    const supabase = createServerSupabaseClient()

    try {
        const session = await getSession()
        const { data: user } = await supabase
            .from("student")
            .select("*")
            .eq("id", session?.user.id ?? "")
            .single()

        return user
    } catch (e) {
        console.error(e)
        return null
    }
}
