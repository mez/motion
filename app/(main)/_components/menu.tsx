import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { pb } from "@/lib/pb";
import { Document } from "@/types/database";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
  documentId: string;
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const {user} = useAuth();

  const onArchive = async () => {
    // think with pocketbase; using the jssdk directly instead of mutation is less code to write. 
     const archivePromise = pb.collection('documents').update<Document>(documentId, {
      isArchived: true
     });

     toast.promise(archivePromise, {
      loading: "Moving note to trash...",
      success: 'Note moved to trash!',
      error: "Failed to archive note."
     });

     router.push('/documents')
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2"/>
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-sm text-muted-foreground p-2">
          Last edited by: {user.name}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default Menu;

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className="h-10 w-10" />
  )
}
