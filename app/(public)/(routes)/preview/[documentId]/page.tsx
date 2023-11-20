"use client";

import dynamic from "next/dynamic";
import Cover from "@/components/cover";
import Toolbar from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { pb } from "@/lib/pb";
import { Document } from "@/types/database";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

interface PreviewPageProps {
  params: { documentId: string };
}

const  PreviewPage = ({ params }: PreviewPageProps) => {
  const {
    isError,
    isLoading,
    data: document,
    error
  } = useQuery<Document>({ queryKey: ["preview", params.documentId],
  queryFn: ({queryKey}) => {
    return pb.collection('documents').getOne(queryKey[1] as string);
  }
});
  const router = useRouter();

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );

  const onChange = useDebouncedCallback( async (content: string) => {
    try {
      if (document === null) return;
      await pb.collection("documents").update(document?.id!, {
        content,
      });
    } catch (error) {
      console.log("PB error: ", error);
    }
  }, 1000);


  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10 ">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[50%]" />
            <Skeleton className="h-4 w-[40%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === undefined) {
    return <p>Not found</p>;
  }

  return (
    <div className="pb-40">
      <Cover preview url={pb.files.getUrl(document, document.coverImage!)} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document} />
        <Editor editable={false} onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default  PreviewPage;
