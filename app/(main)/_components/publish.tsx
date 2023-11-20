'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { pb } from "@/lib/pb";
import { Document } from "@/types/database";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PublishProps {
  initialData: Document;
}

const Publish = ({
  initialData
}:PublishProps) => {

  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData.id}`

  const onPublish = () => {
    setIsSubmitting(true);

    const publishPromise = pb.collection('documents').update<Document>(initialData.id, {
      isPublished: true
    }).finally( () => {
      setIsSubmitting(false);
    })

    toast.promise(publishPromise, {
      loading: 'Publishing....',
      success: "Note published!",
      error: 'Faild to publish note.'
    })
  }

  const onUnpublish = () => {
    setIsSubmitting(true);

    const publishPromise = pb.collection('documents').update<Document>(initialData.id, {
      isPublished: false
    }).finally( () => {
      setIsSubmitting(false);
    })

    toast.promise(publishPromise, {
      loading: 'Unpublishing....',
      success: "Note unpublished!",
      error: 'Faild to unpublish note.'
    })
  }


  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout( () => {
      setCopied(false);
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
        >
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72"
        align="end"
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <Globe className="text-sky-500 animate-pulse h-4 w-4" />
                <p className="text-xs font-medium text-sky-500">
                  This note is live on web.
                </p>
              </div>
              <div className="flex items-center">
                <input 
                  value={url}
                  className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                  disabled
                />
                <Button
                  onClick={onCopy}
                  disabled={copied}
                  className="h-8 rounded-l-none"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                size='sm'
                className="w-full text-xs"
                disabled={isSubmitting}
                onClick={onUnpublish}
              >
                Unpublish
              </Button>
            </div>
          ): (
            <div className="flex flex-col items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-2">
                Publish this note.
              </p>
              <span className="text-xs text-muted-foreground mb-4">
                Share your work with others.
              </span>
              <Button
                disabled={isSubmitting}
                onClick={onPublish}
                className="w-full text-xs"
                size='sm'
              >
                Publish
              </Button>
            </div>
          )}
      </PopoverContent>
    </Popover>
  )
}

export default Publish