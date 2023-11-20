"use client";

import Spinner from "@/components/spinner";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import Navigation from "./_components/navigation";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SearchCommand from "@/components/search-command";

function MainLayout({ children }: { children: ReactNode }) {
  const { unauthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (unauthenticated) {
    return redirect("/");
  }

  return (
    <>
      <div className="h-full flex dark:bg-[#1f1f1f]">
        <Navigation />
        <main className="h-full flex-1 overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default MainLayout;
