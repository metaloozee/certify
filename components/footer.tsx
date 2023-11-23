import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Footer = () => {
    return (
        <footer className="absolute w-full top-full">
            <div className="container border-t bg-background flex flex-col flex-wrap items-center justify-center py-8 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap">
                <div className="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left space-y-2">
                    <Link href={"/"} className="text-2xl font-bold">
                        Certify
                    </Link>
                    <p className="text-slate-500 text-xs">
                        &copy; 2024 All Rights Reserved
                    </p>
                </div>
                <div className="justify-between w-full mt-6 lg:mt-0 text-center lg:text-left lg:flex">
                    <div className="w-full px-4 lg:w-1/3 md:w-1/2">
                        <h2 className="font-semibold">Quick Links</h2>
                        <ul className="mt-2 space-y-2 text-sm list-none">
                            <li>
                                <Link
                                    href={"/"}
                                    className="text-slate-500 hover:text-primary"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={"/admin"}
                                    className="text-slate-500 hover:text-primary"
                                >
                                    Admin Panel
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={
                                        "https://github.com/metaloozee/certify"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-500 hover:text-primary"
                                >
                                    Source Code
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full mt-6 lg:mt-0 px-4 lg:w-1/3 md:w-1/2">
                        <h1 className="font-semibold">Collaborators</h1>
                        <div className="flex justify-center items-center lg:justify-start mt-2 text-sm gap-4">
                            <Link
                                href={"https://github.com/metaloozee"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Avatar>
                                    <AvatarImage src="https://github.com/metaloozee.png" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                            </Link>
                            <Link
                                href={"https://github.com/legit-programmer"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Avatar>
                                    <AvatarImage src="https://github.com/legit-programmer.png" />
                                    <AvatarFallback>S</AvatarFallback>
                                </Avatar>
                            </Link>
                            <Link
                                href={"https://github.com/Anshsingh99"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Avatar>
                                    <AvatarImage src="https://github.com/Anshsingh99.png" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full px-4 mt-6 lg:mt-0 lg:w-2/3 md:w-1/2">
                        <h2 className="font-semibold">Feedback</h2>
                        <div className="flex gap-2 mt-2">
                            <Input
                                disabled
                                placeholder="Your feedback here.."
                            />
                            <Button disabled>Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
