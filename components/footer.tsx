import Link from "next/link"

export const Footer = () => {
    return (
        <div className="bg-slate-900/50 w-full md:max-w-sm md:rounded-full md:mb-2 px-6 py-4 backdrop:blur backdrop-blur-md">
            <p className="text-center text-slate-500 text-xs">
                Made with ❤️ by{" "}
                <Link
                    className="underline"
                    href={"https://github.com/Anshsingh99"}
                >
                    Ansh Singh
                </Link>
                ,{" "}
                <Link
                    className="underline"
                    href={"https://instagram.com/ayannparkar"}
                >
                    Ayan Parkar
                </Link>{" "}
                &amp;{" "}
                <Link
                    className="underline"
                    href={"https://github.com/legit-programmer"}
                >
                    Siddique Khan
                </Link>
            </p>
        </div>
    )
}
