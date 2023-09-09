import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Index() {
  return (
    <>
      <h1>Hello World</h1>
    </>
  );
}
