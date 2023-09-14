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
            admin: {
                Row: {
                    id: string
                }
                Insert: {
                    id: string
                }
                Update: {
                    id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "admin_id_fkey"
                        columns: ["id"]
                        referencedRelation: "student"
                        referencedColumns: ["id"]
                    },
                ]
            }
            event: {
                Row: {
                    date: string | null
                    description: string | null
                    id: string
                    isopen: boolean | null
                    name: string | null
                    runner_up: string | null
                    second_runner_up: string | null
                    team_limit: number
                    winner: string | null
                }
                Insert: {
                    date?: string | null
                    description?: string | null
                    id?: string
                    isopen?: boolean | null
                    name?: string | null
                    runner_up?: string | null
                    second_runner_up?: string | null
                    team_limit?: number
                    winner?: string | null
                }
                Update: {
                    date?: string | null
                    description?: string | null
                    id?: string
                    isopen?: boolean | null
                    name?: string | null
                    runner_up?: string | null
                    second_runner_up?: string | null
                    team_limit?: number
                    winner?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "event_runner_up_fkey"
                        columns: ["runner_up"]
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "event_second_runner_up_fkey"
                        columns: ["second_runner_up"]
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "event_winner_fkey"
                        columns: ["winner"]
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                ]
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
            templatecords: {
                Row: {
                    class_cords: string[] | null
                    event_id: string
                    eventname_cords: string[] | null
                    id: number
                    name_cords: string[] | null
                }
                Insert: {
                    class_cords?: string[] | null
                    event_id: string
                    eventname_cords?: string[] | null
                    id?: number
                    name_cords?: string[] | null
                }
                Update: {
                    class_cords?: string[] | null
                    event_id?: string
                    eventname_cords?: string[] | null
                    id?: number
                    name_cords?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "templatecords_event_id_fkey"
                        columns: ["event_id"]
                        referencedRelation: "event"
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
