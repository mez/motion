'use client';

import { useEffect, useState } from "react";
import SettingsModal from "@/components/modals/settings-modal";
import CoverImageModel from "@/components/modals/cover-image-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])
  
  if (!isMounted) return null;

  return (
    <>
    <SettingsModal />
    <CoverImageModel />
    </>
  )
}

export default ModalProvider