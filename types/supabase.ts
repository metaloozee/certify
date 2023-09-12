export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            event: {
                Row: {
                    date: string | null
                    description: string | null
                    id: string
                    isopen: boolean | null
                    name: string | null
                    team_limit: number
                }
                Insert: {
                    date?: string | null
                    description?: string | null
                    id?: string
                    isopen?: boolean | null
                    name?: string | null
                    team_limit?: number
                }
                Update: {
                    date?: string | null
                    description?: string | null
                    id?: string
                    isopen?: boolean | null
                    name?: string | null
                    team_limit?: number
                }
                Relationships: []
            }
            eventparticipant: {
                Row: {
                    event_id: string | null
                    group_id: string | null
                    id: string
                }
                Insert: {
                    event_id?: string | null
                    group_id?: string | null
                    id?: string
                }
                Update: {
                    event_id?: string | null
                    group_id?: string | null
                    id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "eventparticipant_event_id_fkey"
                        columns: ["event_id"]
                        referencedRelation: "event"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "eventparticipant_group_id_fkey"
                        columns: ["group_id"]
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                ]
            }
            group: {
                Row: {
                    id: string
                    name: string | null
                }
                Insert: {
                    id?: string
                    name?: string | null
                }
                Update: {
                    id?: string
                    name?: string | null
                }
                Relationships: []
            }
            groupmember: {
                Row: {
                    group_id: string | null
                    id: string
                    student_id: string | null
                }
                Insert: {
                    group_id?: string | null
                    id?: string
                    student_id?: string | null
                }
                Update: {
                    group_id?: string | null
                    id?: string
                    student_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "groupmember_group_id_fkey"
                        columns: ["group_id"]
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "groupmember_student_id_fkey"
                        columns: ["student_id"]
                        referencedRelation: "student"
                        referencedColumns: ["id"]
                    },
                ]
            }
            student: {
                Row: {
                    class: string | null
                    enrollment: string | null
                    first_name: string | null
                    id: string
                    last_name: string | null
                }
                Insert: {
                    class?: string | null
                    enrollment?: string | null
                    first_name?: string | null
                    id: string
                    last_name?: string | null
                }
                Update: {
                    class?: string | null
                    enrollment?: string | null
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "student_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
