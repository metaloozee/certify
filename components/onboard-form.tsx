"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    createClientComponentClient,
    Session,
} from "@supabase/auth-helpers-nextjs"
import { Terminal } from "lucide-react"

import { Database } from "@/types/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const OnboardingForm = () => {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [branch, setBranch] = useState("IF")
    const [year, setYear] = useState("SY")
    const [enroll, setEnroll] = useState("")
    const [isValid, setIsValid] = useState(true)
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const handleClick = () => {
        if (fname !== "" && lname !== "" && enroll !== "") {
            console.log("in")

            supabase.auth.getSession().then((data) => {
                const user = data.data.session?.user
                if (user !== undefined) {
                    console.log("final")

                    supabase
                        .from("student")
                        .insert({
                            id: user?.id,
                            first_name: fname,
                            last_name: lname,
                            enrollment: enroll,
                            class: year.concat(branch),
                        })
                        .then(() => {
                            console.log("updated")
                            router.push("/")
                        })
                }
            })
        } else {
            setIsValid(false)
        }
    }

    return (
        <div className="form flex h-[75vh] items-center">
            <div>
                {!isValid && (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            Details entered are not quite what we had
                            expected...
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex">
                    <div className="mx-5">
                        <Label htmlFor="fname">First Name</Label>
                        <Input
                            type="text"
                            id="fname"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        ></Input>
                    </div>
                    <div>
                        <Label htmlFor="lname">Last Name</Label>
                        <Input
                            type="text"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            id="lname"
                        ></Input>
                    </div>
                </div>

                <div className="mx-5 ">
                    <Label htmlFor="enroll">Enrollment No.</Label>
                    <Input
                        type="number"
                        id="enroll"
                        onChange={(e) => setEnroll(e.target.value)}
                        value={enroll}
                    ></Input>
                    <div className="flex">
                        <div className="m-3">
                            <Label className="mr-5" htmlFor="branch">
                                Branch
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Open</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                        Panel Position
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
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
                        <div className="m-3 ml-5">
                            <Label className="mr-4" htmlFor="year">
                                Year
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Open</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                        Panel Position
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
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

                <Button onClick={handleClick} className="m-5">
                    Register
                </Button>
            </div>
        </div>
    )
}

export default OnboardingForm
