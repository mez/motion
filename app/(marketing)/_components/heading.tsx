"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function Heading() {
  const { authenticated, loading } = useAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Motion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Motion is the connected workspace where better, faster work happens.
      </h3>
      {loading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {authenticated && !loading && (
        <Button asChild>
          <Link href="/documents">Enter Motion
          
          <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      )}
      {!authenticated && !loading && (
        <Button asChild>
          <Link href="/join">
            Get Motion free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default Heading;
