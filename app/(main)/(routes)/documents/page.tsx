"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { pb } from "@/lib/pb";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


function DocumentsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const onCreateNote = async () => {
    const document = pb.collection('documents').create({
      user: user.id,
      title: 'Untitled'
    });

    document.then(doc => {
      router.push(`/documents/${doc.id}`)
    })

    toast.promise(document, {
      loading: 'Create a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.'
    })
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="empty"
        className="dark:hidden"
        priority
      />
      <Image
        src="/empty-dark.png"
        height={300}
        width={300}
        alt="empty"
        className="dark:block hidden"
        priority
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.name.split(" ")[0]}&apos;s Motion
      </h2>
      <Button onClick={onCreateNote}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}

export default DocumentsPage;
