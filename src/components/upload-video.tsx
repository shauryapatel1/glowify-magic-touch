
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlowUpCard } from "@/components/ui/glow-up-card";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, X } from "lucide-react";
import { v4 as uuidv4 } from "@supabase/supabase-js/dist/module/lib/helpers";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  video: z.instanceof(File, { message: "Video file is required" })
});

type UploadForm = z.infer<typeof uploadSchema>;

export const UploadVideo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
    }
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("video", file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    form.setValue("video", undefined as any);
  };

  const onSubmit = async (data: UploadForm) => {
    if (!user || !selectedFile) return;
    
    setIsUploading(true);
    try {
      // 1. Create a video record in the database
      const videoId = uuidv4();
      const filePath = `${user.id}/${videoId}/${selectedFile.name}`;
      
      // 2. Upload the file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("videos")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          },
        });

      if (uploadError) throw uploadError;

      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      // 4. Create the video record
      const { error: dbError } = await supabase.from("videos").insert({
        id: videoId,
        title: data.title,
        description: data.description || null,
        original_url: publicUrlData.publicUrl,
        status: "pending",
        user_id: user.id
      });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded and is being processed.",
      });
      
      setOpen(false);
      form.reset();
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your video.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={() => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl>
                    {!selectedFile ? (
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-600 hover:border-gray-500 bg-gray-700/30"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">MP4, MOV, or WebM (Max 500MB)</p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={onFileChange}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="relative flex items-center p-4 bg-gray-700/20 rounded-lg">
                        <div className="flex-1 truncate">
                          <p className="font-medium truncate">{selectedFile.name}</p>
                          <p className="text-xs text-gray-400">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={clearSelectedFile}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                          <span className="sr-only">Remove file</span>
                        </button>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUploading && (
              <div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm mt-2 text-gray-400">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <DialogFooter>
              <GlowUpButton
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full"
                glowEffect
              >
                {isUploading ? "Uploading..." : "Upload Video"}
              </GlowUpButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
