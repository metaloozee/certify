import Link from "next/link"

export const Footer = () => {
    return (
        <div className="bg-slate-200/50 dark:bg-slate-900/50 w-full md:max-w-sm md:rounded-full md:mb-2 px-6 py-4 backdrop:blur backdrop-blur-md">
            <p className="text-center text-slate-500 text-xs">
                Made with ❤️ by{" "}
                <Link
                    className="underline"
                    href={"https://github.com/Anshsingh99"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ansh Singh
                </Link>
                ,{" "}
                <Link
                    className="underline"
                    href={"https://github.com/metaloozee"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ayan Parkar
                </Link>{" "}
                &amp;{" "}
                <Link
                    className="underline"
                    href={"https://github.com/legit-programmer"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Siddique Khan
                </Link>
            </p>
        </div>
    )
}
