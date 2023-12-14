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
                        isOneToOne: true
                        referencedRelation: "student"
                        referencedColumns: ["id"]
                    },
                ]
            }
            event: {
                Row: {
                    branchwise: boolean
                    date: string | null
                    description: string | null
                    id: string
                    isopen: boolean | null
                    name: string | null
                    team_limit: number
                }
                Insert: {
                    branchwise?: boolean
                    date?: string | null
                    description?: string | null
                    id?: string
                    isopen?: boolean | null
                    name?: string | null
                    team_limit?: number
                }
                Update: {
                    branchwise?: boolean
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
                        isOneToOne: false
                        referencedRelation: "event"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "eventparticipant_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: true
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                ]
            }
            eventresult: {
                Row: {
                    branch: string
                    event_id: string | null
                    id: string
                    runner_up: string | null
                    second_runner_up: string | null
                    winner: string | null
                }
                Insert: {
                    branch: string
                    event_id?: string | null
                    id?: string
                    runner_up?: string | null
                    second_runner_up?: string | null
                    winner?: string | null
                }
                Update: {
                    branch?: string
                    event_id?: string | null
                    id?: string
                    runner_up?: string | null
                    second_runner_up?: string | null
                    winner?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "eventresult_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "event"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "eventresult_runner_up_fkey"
                        columns: ["runner_up"]
                        isOneToOne: false
                        referencedRelation: "eventparticipant"
                        referencedColumns: ["group_id"]
                    },
                    {
                        foreignKeyName: "eventresult_second_runner_up_fkey"
                        columns: ["second_runner_up"]
                        isOneToOne: false
                        referencedRelation: "eventparticipant"
                        referencedColumns: ["group_id"]
                    },
                    {
                        foreignKeyName: "eventresult_winner_fkey"
                        columns: ["winner"]
                        isOneToOne: false
                        referencedRelation: "eventparticipant"
                        referencedColumns: ["group_id"]
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
                        isOneToOne: false
                        referencedRelation: "group"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "groupmember_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "student"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    content: string | null
                    created_at: string
                    from: string | null
                    id: string
                    opened: boolean | null
                }
                Insert: {
                    content?: string | null
                    created_at?: string
                    from?: string | null
                    id?: string
                    opened?: boolean | null
                }
                Update: {
                    content?: string | null
                    created_at?: string
                    from?: string | null
                    id?: string
                    opened?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_from_fkey"
                        columns: ["from"]
                        isOneToOne: false
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
                    is_edited: boolean | null
                    last_name: string | null
                }
                Insert: {
                    class?: string | null
                    enrollment?: string | null
                    first_name?: string | null
                    id: string
                    is_edited?: boolean | null
                    last_name?: string | null
                }
                Update: {
                    class?: string | null
                    enrollment?: string | null
                    first_name?: string | null
                    id?: string
                    is_edited?: boolean | null
                    last_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "student_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
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

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
          Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
          Database["public"]["Views"])[PublicTableNameOrOptions] extends {
          Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof Database["public"]["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
          Insert: infer I
      }
        ? I
        : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof Database["public"]["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
          Update: infer U
      }
        ? U
        : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof Database["public"]["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
