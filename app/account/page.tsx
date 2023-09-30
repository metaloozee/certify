import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function AccountPage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold">Unauthorized</h1>
                <p>
                    Please login or setup your account in order to view this
                    page
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p>Page Under Development</p>
        </div>
    )
}
