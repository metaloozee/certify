import Link from "next/link";

export const Footer = () => {
  return (
    <p className="text-center mb-5 text-neutral-500 text-xs">
      Made with ❤️ by <Link href={""}>Ansh Singh</Link>,{" "}
      <Link href={""}>Ayan Parkar</Link> &amp;{" "}
      <Link href={""}>Siddique Khan</Link>
    </p>
  );
};
