"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/pb";
import { Document } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: string;
}
const Banner = ({ documentId }: BannerProps) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  // Not a fan of the duplication of code, but I haven't figured out a better pattern for this yet.
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await pb.collection("documents").delete(documentId);

      queryClient.setQueryData<Document[]>(
        ["documents", "archived"],
        (oldDocs) => {
          return oldDocs?.filter((doc) => doc.id !== documentId);
        },
      );
    },
  });

  const restoreDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await pb.collection("documents").update<Document>(documentId, {
        isArchived: false,
      });

      queryClient.setQueryData<Document[]>(
        ["documents", "archived"],
        (oldDocs) => {
          return oldDocs?.filter((doc) => doc.id !== documentId);
        },
      );
    },
  });

  const onRemove = () => {
    const deletePromise = deleteDocumentMutation.mutateAsync(documentId);

    deletePromise.then((value) => router.push("/documents"));

    toast.promise(deletePromise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });
  };

  const onRestore = () => {
    const restorePromise = restoreDocumentMutation.mutateAsync(documentId);

    toast.promise(restorePromise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the trash.</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModal
        onConfirm={onRemove}
      >
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
