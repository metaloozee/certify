import { Database } from "@/types/supabase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EventForm } from "@/components/event-form"
import OnboardingForm from "@/components/onboard-form"
import { createServerSupabaseClient, getSession } from "@/app/supabase-server"

export default async function OnBoardPage({ params }: { params: any }) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    return <OnboardingForm />
}
