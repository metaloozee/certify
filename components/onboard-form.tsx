"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RocketIcon } from "@radix-ui/react-icons"
import type { Session } from "@supabase/auth-helpers-nextjs"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSupabase } from "@/app/supabase-provider"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export const OnboardingForm = ({ session }: { session: Session | null }) => {
    const { supabase } = useSupabase()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [fname, setFname] = useState<string | null>(null)
    const [lname, setLname] = useState<string | null>(null)
    const [branch, setBranch] = useState<string>("IF")
    const [year, setYear] = useState("TY")
    const [enroll, setEnroll] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)

            if (
                (fname && fname.length > 0) ||
                (lname && lname.length > 0) ||
                (enroll && enroll.length > 0)
            ) {
                // Checking if existing user with the same enrollment number exists or not
                const { data: existingUser, error: existingUserError } =
                    await supabase
                        .from("student")
                        .select("*")
                        .eq("enrollment", enroll ?? "")
                        .maybeSingle()
                if (existingUserError) {
                    throw new Error(existingUserError.message)
                }
                if (existingUser) {
                    throw new Error(
                        "User already exists with the same Enrollment number"
                    )
                }

                // Adding the user
                const { error } = await supabase
                    .from("student")
                    .update({
                        first_name: fname,
                        last_name: lname,
                        enrollment: enroll,
                        class: year.concat(branch),
                    })
                    .eq("id", session?.user.id ?? "")
                if (error) {
                    throw new Error(error.message)
                }

                setSuccess(true)
            } else {
                throw new Error("Please enter valid inputs")
            }
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10 container max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex gap-5">
                    <div className="space-y-2 w-full">
                        <Label htmlFor="fname">First Name</Label>
                        <Input
                            disabled={loading}
                            type="text"
                            id="fname"
                            value={fname ?? ""}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <Label htmlFor="lname">Last Name</Label>
                        <Input
                            disabled={loading}
                            type="text"
                            value={lname ?? ""}
                            onChange={(e) => setLname(e.target.value)}
                            id="lname"
                        ></Input>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="enroll">Enrollment No.</Label>
                    <Input
                        disabled={loading}
                        type="number"
                        id="enroll"
                        onChange={(e) => setEnroll(e.target.value)}
                        value={enroll ?? ""}
                    />
                </div>
                <div className="flex gap-5">
                    <div className="space-x-2">
                        <Label htmlFor="branch">Branch</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Open</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuRadioGroup
                                    value={branch}
                                    onValueChange={setBranch}
                                >
                                    <DropdownMenuRadioItem value="IF">
                                        IF
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="EJ">
                                        EJ
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="ME">
                                        ME
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="CO">
                                        CO
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="CE">
                                        CE
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex gap-5">
                        <div className="space-x-2">
                            <Label htmlFor="year">Year</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Open</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuRadioGroup
                                        value={year}
                                        onValueChange={setYear}
                                    >
                                        <DropdownMenuRadioItem value="FY">
                                            FY
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="SY">
                                            SY
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="TY">
                                            TY
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <Button
                    disabled={loading === !success}
                    className="w-full"
                    type="submit"
                >
                    Submit
                </Button>
            </form>

            {error ? (
                <p className="mt-8 text-xs text-red-500">{error}</p>
            ) : (
                <></>
            )}

            {success ? (
                <Alert className="mt-8">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        You have successfully registered yourself!
                    </AlertDescription>
                </Alert>
            ) : (
                <></>
            )}
        </div>
    )
}
