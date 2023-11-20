import { create } from "zustand";

interface CoverImageStore {
  url?: string;
  isOpen: boolean;
  onOpen: (url?:string) => void;
  onClose: () => void;
};


export const useCoverImage = create<CoverImageStore>( (set, get) => ({
  isOpen: false,
  onOpen: (url?: string) => set({isOpen: true, url}),
  onClose: () => set({isOpen: false}),
}))