"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, {
  ElementRef,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import { pb } from "@/lib/pb";
import { RecordListOptions, RecordSubscription } from "pocketbase";
import Item from "./item";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DocumentList from "./document-list";
import { Document } from "@/types/database";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import Navbar from "./navbar";

function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const search = useSearch()
  const settings = useSettings();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResettng, setIsResettng] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const queryClient = useQueryClient();


  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResettng(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResettng(false);
      }, 300);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile, resetWidth]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile, pathname]);

  useEffect(() => {
    const handleDocumentUpdate = (data: RecordSubscription<Document>) => {
      if (data.action === "create") {
        queryClient.setQueryData<Document[]>(
          ["documents", data.record.parentDocument],
          (oldDocs) => {
            if (!oldDocs) return [data.record];

            return [...oldDocs, data.record];
          },
        );
      } else if (data.action === "update") {
        queryClient.setQueryData<Document[]>(
          ["documents", data.record.parentDocument],
          (oldDocs) => {
            if (!oldDocs) return [data.record];

            const newDocs = oldDocs!.filter((doc) => doc.id !== data.record.id);
            if (!data.record.isArchived) {
              newDocs.unshift(data.record);
              newDocs.sort();
            }
            return newDocs;
          },
        );

        queryClient.setQueryData<Document>(
          ['getDocumentById', data.record.id],
          (oldDoc) => {
            return data.record
          }
        )
      } else if (data.action === "delete") {
        queryClient.setQueryData<Document[]>(
          ["documents", data.record.parentDocument],
          (oldDocs) => {
            return oldDocs?.filter((doc) => doc.id !== data.record.id);
          },
        );
      }
    };

    pb.collection("documents").subscribe("*", handleDocumentUpdate);

    return () => {
      pb.collection("documents").unsubscribe("*");
    };
  }, [queryClient]);

  const handleMouseMove = (event: MouseEventInit) => {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX!;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResettng(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => {
        setIsResettng(false);
      }, 300);
    }
  };

  // TODO: pull this out and DRY it up. Maybe a Documents Context/Provider
  const onCreateNote = async () => {
    const document = pb.collection("documents").create({
      user: user.id,
      title: "Untitled",
    });


    document.then( (doc) => {
      router.push(`/documents/${doc.id}`)
    })

    toast.promise(document, {
      loading: "Create a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResettng && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-smhover:bg-neutral-300 \
          dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 \
          group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItem />
          <Item onClick={search.onOpen} label="Search" icon={Search} isSearch />
          <Item onClick={settings.onOpen} label="Settings" icon={Settings} />
          <Item onClick={onCreateNote} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={onCreateNote} icon={Plus} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >

              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] w-[calc(100%-240px)]",
          isResettng && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full",
        )}
      >
        { !!params.documentId ? (
          <Navbar 
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        ): (
           <nav className="bg-transparent px-3 py-2 w-full">
           {isCollapsed && (
             <MenuIcon
               onClick={resetWidth}
               role="button"
               className="h-6 w-6 text-muted-foreground"
             />
           )}
         </nav>
        )}
       
      </div>
    </>
  );
}

export default Navigation;
