import Link from "next/link"

import { EditProfileForm } from "@/components/edit-profile-form"
import { OnboardingForm } from "@/components/onboard-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function AccountPage() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data } = await supabase
        .from("student")
        .select("*")
        .eq("id", session?.user.id ?? "")
        .single()

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
            {data !== null ? (
                <EditProfileForm session={session} data={data} />
            ) : (
                <h1>
                    Please register yourself <Link href={"/welcome"}>here</Link>
                </h1>
            )}
        </div>
    )
}
