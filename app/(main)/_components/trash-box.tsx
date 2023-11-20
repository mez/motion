"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import Spinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { pb } from "@/lib/pb";
import { Document } from "@/types/database";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { RecordListOptions } from "pocketbase";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";

function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");


  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await pb.collection("documents").delete(documentId);

      queryClient.setQueryData<Document[]>(
        ["documents", 'archived'],
        (oldDocs) => {
          return oldDocs?.filter((doc) => doc.id !== documentId);
        },
      );
    },
    onError: (error, variables, context) => {
      toast.error("Failed to delete note.")
    },
    onSuccess: (data, variables, context) => {
      toast.success("Note deleted!")
    }
  });

  const restoreDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
     await pb.collection("documents").update<Document>(documentId, {
        isArchived: false,
      });

      queryClient.setQueryData<Document[]>(
        ["documents", 'archived'],
        (oldDocs) => {
          return oldDocs?.filter((doc) => doc.id !== documentId);
        },
      );
    },
    onError: (error, variables, context) => {
      toast.error("Failed to restore note.")
    },
    onSuccess: (data, variables, context) => {
      toast.success("Note restored!")
    }
  });

  const { isLoading, data: archivedDocuments } = useQuery<Document[]>({
    queryKey: ["documents", "archived"],
    queryFn: (context) => {
      const options: RecordListOptions = {
        filter: pb.filter(`isArchived={:status}`, { status: true }),
        sort: "-created",
      };

      return pb.collection("documents").getFullList<Document>(options);
    },
  });

  const filteredDocuments = archivedDocuments?.filter((doc) =>
    doc.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: MouseEvent<HTMLDivElement>,
    documentId: string,
  ) => {
    event.stopPropagation();

    restoreDocumentMutation.mutate(documentId);
  };

  const onDelete = (documentId: string) => {
    deleteDocumentMutation.mutate(documentId);

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2"> No documents found.</p>
        {filteredDocuments?.map( doc => (
          <div
            key={doc.id}
            role="button"
            onClick={() => onClick(doc.id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">
              {doc.title}
            </span>
            <div className="flex items-center" >
              <div
                role="button"
                onClick={(e) => onRestore(e, doc.id)}
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal
                onConfirm={() => onDelete(doc.id)}
              >
              <div
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Trash className="h-4 w-4 text-muted-foreground" />
              </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashBox;
