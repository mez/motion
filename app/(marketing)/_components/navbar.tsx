"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import React, { useContext } from "react";
import Logo from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { AuthContext } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import Link from "next/link";
import UserButton from "@/components/user-button";

function Navbar() {
  const scrolled = useScrollTop();
  const { authenticated, user, loading } = useContext(AuthContext);

  return (
    <div
      className={cn(
        "z-50 dark:bg-[#1f1f1f] bg-background fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm",
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {loading && <Spinner />}
        {!loading && !authenticated && (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href="/login"> Login</Link>
            </Button>
            <Button  size={"sm"} asChild>
              <Link href="/join"> Join Motion free</Link>
            </Button>
          </>
        )}
        {authenticated && !loading && (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href="/documents"> Enter Motion</Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
