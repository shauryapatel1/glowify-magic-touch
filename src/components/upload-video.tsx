
import React, { useState } from "react";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UploadCloud } from "lucide-react";
import { UploadForm } from "./upload/upload-form";

export const UploadVideo = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <GlowUpButton glowEffect size="lg">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload New Video
        </GlowUpButton>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload a new video</DialogTitle>
          <DialogDescription>
            Upload your video to apply GlowUp's AI effects.
          </DialogDescription>
        </DialogHeader>

        <UploadForm 
          onUploadComplete={() => setOpen(false)} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
