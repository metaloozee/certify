import { AuthError } from "@/components/authentication-error"
import { OnboardingForm } from "@/components/onboard-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function OnBoardPage() {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        const { data, error } = await supabase
            .from("student")
            .select("*")
            .eq("id", session?.user.id)
            .single()

        if (error) {
            return <AuthError />
        }

        if (data.enrollment == null) {
            return <OnboardingForm session={session} />
        }
    }

    if (!session) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center text-center">
                <h1 className="text-3xl font-bold">Unauthorized</h1>
                <p className="text-slate-500">
                    Please login or setup your account in order to view this
                    page
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center text-center">
            <h1 className="text-3xl font-bold">Already Registered</h1>
            <p className="text-slate-500">
                You have already finished setting up your account!
            </p>
        </div>
    )
}
