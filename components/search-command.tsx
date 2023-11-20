'use client';

import { useAuth } from "@/hooks/use-auth";
import { useSearch } from "@/hooks/use-search";
import { pb } from "@/lib/pb";
import { useQuery } from "@tanstack/react-query";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { RecordListOptions } from "pocketbase";
import { useEffect, useState } from "react";


import React from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Document } from "@/types/database";

function SearchCommand() {
  const {user} = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch( store => store.toggle);
  const isOpen = useSearch( store => store.isOpen);
  const onClose = useSearch( store => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        toggle();
      }
    }

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    }
  }, [toggle])

  const {
    isLoading,
    isPending,
    isError,
    data: documents,
    error,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: (qfContext) => {
      
      const options: RecordListOptions = { 
        filter: pb.filter(
          `isArchived={:status}`,
          { status: false },
        ),
        fields:'id,title',
        sort: "-created",
      };

      return pb.collection("documents").getFullList<Document>(options);
    },
  });


  const onSelect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
    onClose();
  }

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput 
        placeholder={`Search ${user?.name}'s motion...`}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map( doc => (
            <CommandItem
              key={doc.id}
              value={`${doc.id}-${doc.title}`}
              title={doc.title}
              onSelect={onSelect}
            >
              {doc.icon ? (
                <p className="mr-2 text-[18px]">
                  {doc.icon}
                </p>
              ):(
                <File className="h-4 w-4 mr-2" />
              ) }
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default SearchCommand