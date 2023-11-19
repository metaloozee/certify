"use server"

import { EventData } from "@/components/event-card"

import { createServerSupabaseClient } from "./supabase-server"

const supabase = createServerSupabaseClient()
export default async function fetchGroups(eventdata: EventData) {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data } = await supabase
        .from("eventparticipant")
        .select(`group!inner(id, groupmember!inner(student_id))`)
        .eq("group.groupmember.student_id", session?.user.id ?? "")
        .eq("event_id", eventdata?.id ?? "")

    if (data) {
        const group_id = data[0].group?.id
        if (group_id) {
            const { data: members } = await supabase
                .from("groupmember")
                .select("student(first_name, enrollment)")
                .eq("group_id", group_id)
            return { groups: data, members: members }
        }
    }
}
