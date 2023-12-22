"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RocketIcon } from "@radix-ui/react-icons"
import type { Session } from "@supabase/auth-helpers-nextjs"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useSupabase } from "@/app/supabase-provider"

export type ExistingUser = {
    class: string | null
    enrollment: string | null
    first_name: string | null
    id: string
    last_name: string | null
    contact_number: string | null
}

export const EditProfileForm = ({
    session,
    data,
}: {
    session: Session | null
    data: ExistingUser
}) => {
    const br = data.class?.slice(2)
    const yr = data.class?.slice(0, 2)

    const [fname, setFname] = useState<string | null>(data?.first_name)
    const [lname, setLname] = useState<string | null>(data.last_name)
    const [branch, setBranch] = br
        ? useState<string>(br)
        : useState<string>("IF")
    const [year, setYear] = yr ? useState<string>(yr) : useState<string>("TY")
    const [enroll, setEnroll] = useState<string | null>(data.enrollment)
    const [contactNumber, setContactNumber] = useState<string | null>(
        data.contact_number
    )

    const router = useRouter()
    const { supabase } = useSupabase()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setError(null)
            setLoading(true)

            if (
                fname &&
                fname.length > 0 &&
                fname.trim() !== "" &&
                lname &&
                lname.length > 0 &&
                lname.trim() !== "" &&
                enroll &&
                enroll.length > 0 &&
                enroll.trim() !== "" &&
                contactNumber &&
                contactNumber.length === 10
            ) {
                const { data } = await supabase
                    .from("student")
                    .select("class, is_edited")
                    .eq("id", session?.user.id ?? "")
                    .maybeSingle()

                if (data?.class?.slice(2) === branch || !data?.is_edited) {
                    const { error } = await supabase
                        .from("student")
                        .update({
                            first_name: fname,
                            last_name: lname,
                            enrollment: enroll,
                            contact_number: contactNumber,
                            class: year.concat(branch),
                            is_edited:
                                data?.class?.slice(2) !== branch ||
                                data?.is_edited,
                        })
                        .eq("id", session?.user.id ?? "")
                    if (error) {
                        throw new Error(error.message)
                    }
                    setSuccess(true)
                    router.refresh()
                } else {
                    toast({
                        variant: "destructive",
                        title: "Cannot edit branch!",
                        description:
                            "Please contact administrator for any changes.",
                    })
                }
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
        <div className="flex justify-center items-center h-[68vh] container max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
                <h1 className="text-3xl text-center font-bold">
                    Account Settings
                </h1>
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
                        disabled={true}
                        type="number"
                        id="enroll"
                        onChange={(e) => setEnroll(e.target.value)}
                        value={enroll ?? ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                        disabled={loading}
                        type="number"
                        id="contactNumber"
                        onChange={(e) => setContactNumber(e.target.value)}
                        value={contactNumber ?? ""}
                    />
                </div>

                <div className="flex gap-5">
                    <div className="flex gap-5">
                        <div className="space-x-2 flex items-center justify-center">
                            <Label>Year:</Label>
                            <Select onValueChange={(e) => setYear(e as string)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={year} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Branch</SelectLabel>
                                        <SelectItem value="FY">FY</SelectItem>
                                        <SelectItem value="SY">SY</SelectItem>
                                        <SelectItem value="TY">TY</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-x-2 flex items-center justify-center">
                        <Label>Branch: </Label>
                        <Select onValueChange={(e) => setBranch(e as string)}>
                            <SelectTrigger>
                                <SelectValue placeholder={branch} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Branch</SelectLabel>
                                    <SelectItem value="IF">
                                        Information Technology
                                    </SelectItem>
                                    <SelectItem value="ME">
                                        Mechanical Engineering
                                    </SelectItem>
                                    <SelectItem value="CO">
                                        Computer Engineering
                                    </SelectItem>
                                    <SelectItem value="EJ">
                                        Electrical Engineering
                                    </SelectItem>
                                    <SelectItem value="CE">
                                        Civil Engineering
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <p className=" text-xs font-bold text-slate-500">
                    Note: You can only change your branch once. Please contact
                    administrator for further corrections.
                </p>

                <Button
                    disabled={loading === !success}
                    className="w-full"
                    type="submit"
                >
                    Submit
                </Button>
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
                            Student profile updated successfully!
                        </AlertDescription>
                    </Alert>
                ) : (
                    <></>
                )}
            </form>
        </div>
    )
}
