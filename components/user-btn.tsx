"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Database } from "@/types/supabase";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

export const UserAccount = ({ session }: { session: Session | null }) => {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogOut = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    const user = session.user;

    const getProfile = useCallback(async () => {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("student")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }, [user, supabase]);

    useEffect(() => {
      getProfile();
    }, [user, getProfile]);

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src={avatar_url ?? ""} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {firstName + " " + lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link className="text-center w-full" href={"/account"}>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={handleLogOut}
                  variant={"destructive"}
                  className="w-full"
                >
                  Log Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }

  return <Button onClick={handleLogin}>Login</Button>;
};
