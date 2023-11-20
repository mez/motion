import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { pb } from "@/lib/pb";
import { cn } from "@/lib/utils";
import { Document } from "@/types/database";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  PlusIcon,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { MouseEvent } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ItemProps {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

function Item({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) {
  const handleExpande = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const archiveDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const docs = queryClient.getQueryData<Document[]>(['documents', documentId])

      console.log("Archiving Document: ", documentId);
      console.log("Also archiving Children Documents: ", docs);
      
      const archivedDoc = await pb.collection('documents').update<Document>(documentId, {
        isArchived: true
      });

      // queryClient.invalidateQueries({queryKey: ['documents', archivedDoc.id]});
      if (docs) {
        for (var doc of docs) {
          queryClient.removeQueries({queryKey: ['documents', doc.id]})
        }
      }

      queryClient.removeQueries({queryKey: ['documents', documentId]})

    }
  })

  const onDelete = async (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (!id) return;

    // 1. we set the current document isArchived flag to true.
    archiveDocumentMutation.mutate(id);
    router.push('/documents')
  };

  const onCreate = async (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();

    if (!id) return;

    // maybe this should be a mutation?
    const createDocumentPromise = pb
      .collection("documents")
      .create<Document>({
        user: user.id,
        title: "Untitled",
        parentDocument: id,
      })
      .then((doc) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${doc.id}`)
      });

    toast.promise(createDocumentPromise, {
      loading: "Creating a new note....",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div
      role="button"
      onClick={onClick}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full \
        hover:bg-primary/5 flex items-center \
        text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpande}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 
        select-none items-center gap-1 rounded border bg-muted px-1.5 
        font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onDelete}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="line-clamp-1 text-sm text-muted-foreground p-2">
                Last edited by: {user.name}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
          >
            <PlusIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Item;

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className=""
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
