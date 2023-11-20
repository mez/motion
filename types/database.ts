
export interface Document {
  id: string;
  title: string;
  icon?: string;
  coverImage?: string;
  cover?: string;
  parentDocument?: string;
  isArchived?: boolean;
  isPublished?: boolean;
  content?: string;
}

// this collections supports the uploading of files in the documents.
export interface DocumentFile {
  id: string;
  document: string;
  file: string;
}


