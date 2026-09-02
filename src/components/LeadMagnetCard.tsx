"use client";

import { useState } from "react";
import LeadCaptureModal from "./LeadCaptureModal";

export default function LeadMagnetCard({
  leadMagnet,
  title,
  children,
  className = "",
}: {
  leadMagnet: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`block w-full text-left ${className}`}>
        {children}
      </button>

      <LeadCaptureModal open={open} onClose={() => setOpen(false)} leadMagnet={leadMagnet} title={title} />
    </>
  );
}
