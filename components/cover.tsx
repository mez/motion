"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { pb } from "@/lib/pb";
import { useParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ url, preview }: CoverProps) => {
  const coverImage = useCoverImage();
  const params = useParams();

  const onRemove = async () => {
    
    await pb.collection('documents').update(params.documentId as string, {
      coverImage: ''
    });
    
  }

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url ? "h-[12vh]" : "bg-muted",
      )}
    >
      {!!url && (
        <Image src={url} fill alt="Cover Image" className="object-cover" />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={()=> coverImage.onOpen(url)}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cover;

Cover.Skeleton = function CoverSkeleton() {
  return (
     <Skeleton className="w-full h-[12vh]" />
  )
}