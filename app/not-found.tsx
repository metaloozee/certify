import Image from "next/image"
import Link from "next/link"
import Default from "@/assets/fortnite-default.png"

export default function NotFound() {
    return (
        <div className="container -mt-5 grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
            <Image
                src={Default}
                alt="fortniter nigger"
                width={720}
                height={720}
            />
            <div className="space-y-1 lg:space-y-5">
                <h1 className="text-2xl lg:text-5xl font-bold">
                    Did you take a wrong turn, sunshine?
                </h1>
                <p className="text-xs lg:text-lg max-w-xl text-slate-500">
                    This is Fortnite's Black Default, your friendly guide in the
                    maze of the internet. I'm like a virtual GPS, and you seem
                    to have ventured into the uncharted territory of my
                    codebase. No worries, though! My mission is clear: get you
                    back to the home page. Just hit this{" "}
                    <Link className="text-primary" href={"/"}>
                        magical link
                    </Link>
                    , and let the adventure continue.
                    <br />
                    Cheers to a fabulous time!
                </p>
            </div>
        </div>
    )
}
