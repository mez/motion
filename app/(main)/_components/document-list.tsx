"use client";

import { pb } from "@/lib/pb";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { RecordListOptions, RecordModel } from "pocketbase";
import React, { useState } from "react";
import Item from "./item";
import { cn } from "@/lib/utils";
import { Document } from "@/types/database";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentId?: string;
  level?: number;
  documents?: RecordModel[];
}

function DocumentList({ parentId = "", level = 0 }: DocumentListProps) {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const {
    isLoading,
    isPending,
    isError,
    data: documents,
    error,
  } = useQuery({
    queryKey: ["documents", parentId],
    queryFn: (qfContext) => {
      
      const options: RecordListOptions = {
        filter: pb.filter(
          `isArchived={:status} && parentDocument={:parentId}`,
          { status: false, parentId },
        ),
        sort: "-created",
      };

      return pb.collection("documents").getFullList<Document>(options);
    },
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (!documents) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level*12)+25}px`: undefined
        }}
        className={cn("hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No Pages inside
      </p>
      {documents.map( (doc) => (
        <div key={doc.id}>
          <Item 
            id={doc.id}
            onClick={() => onRedirect(doc.id)}
            label={doc.title}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params.documentId === doc.id}
            level={level}
            onExpand={() => onExpand(doc.id)}
            expanded={expanded[doc.id]}
          />
          {expanded[doc.id] && (
            <DocumentList 
              parentId={doc.id}
              level={level+1}
            />
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList;
