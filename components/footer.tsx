import Link from "next/link"

export const Footer = () => {
    return (
        <p className="text-center  mb-5 text-neutral-500 text-xs">
            Made with ❤️ by{" "}
            <Link className="underline" href={"https://github.com/Anshsingh99"}>
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
    )
}
