"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { pb } from "@/lib/pb";
import { Document } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

interface TitleProps {
  initialData: Document;
}

const Title = ({ initialData }: TitleProps) => {
  const queryClient = useQueryClient();

  const updateDocumentMutation = useMutation({
    mutationKey: ["updateDocument"],
    mutationFn: async (document: Document) => {
      const updatedDocument = await pb
        .collection("documents")
        .update<Document>(document.id, document);

      queryClient.setQueryData<Document>(
        ["getDocumentById", document.id],
        () => {
          return updatedDocument;
        },
      );

      return updatedDocument;
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData.title || "Untitled");

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    updateDocumentMutation.mutate({
      id: initialData.id,
      title: event.target.value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant={"ghost"}
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

export default Title;


Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rounded-md" />
  );
}