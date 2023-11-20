"use client";

import { pb } from "@/lib/pb";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Title from "./title";
import { Document } from "@/types/database";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const {
    isLoading,
    isError,
    data: document,
  } = useQuery<Document>({
    queryKey: ["getDocumentById", params.documentId],
    queryFn: ({ queryKey }) => {
      const documentId = queryKey[1] as string;
      return pb.collection("documents").getOne<Document>(documentId);
    },
  });

  if (isLoading) {
    return (
      <nav className="bg-background dark:bg-[1f1f1f] px-3 py-2 w-full flex justify-between items-center">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-background dark:bg-[1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document!} />
          {!document?.isArchived && (
            <div className="flex items-center gap-x-2">
              <Publish initialData={document!} />
              <Menu documentId={document!.id} />
            </div>
          )}
        </div>
      </nav>
      {document?.isArchived && <Banner documentId={document.id} />}
    </>
  );
};

export default Navbar;
