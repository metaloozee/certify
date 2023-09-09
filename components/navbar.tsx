import Link from "next/link";

import { UserAccount } from "./user-btn";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const Navbar = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Certify</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center">
            <UserAccount session={session} />
          </nav>
        </div>
      </div>
    </header>
  );
};
