'use client';

import {
  BlockNoteEditor,
  PartialBlock
} from '@blocknote/core';

import {
  BlockNoteView,
  useBlockNote
} from '@blocknote/react';

import "@blocknote/core/style.css"
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';
import { pb } from '@/lib/pb';
import { DocumentFile } from '@/types/database';

interface EditorProps {
  initialContent?: string;
  onChange: (value: string) => void;
  editable?: boolean;
};

const Editor = ({
  editable,
  initialContent,
  onChange
}: EditorProps) => {

  const params = useParams();
  const {resolvedTheme} = useTheme();

  const handleFileUpload =async (file:File) => {
    // Add this to files collections.
    const form = new FormData();
    form.append('document', params.documentId as string);
    form.append('file', file);
    console.log("Uploading Image: ", file);

    const fileDoc = await pb.collection('documentFiles').create<DocumentFile>(form);
    return pb.files.getUrl(fileDoc, fileDoc.file);
  }

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    onEditorContentChange(editor) {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleFileUpload
  })

  return (
    <div>
      <BlockNoteView 
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark":"light"}
      />
    </div>
  )
}

export default Editor