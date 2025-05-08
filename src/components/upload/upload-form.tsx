
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlowUpButton } from "@/components/ui/glow-up-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { VideoEffect } from "@/utils/videoUtils";
import { FileDropzone } from "./file-dropzone";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  effect: z.enum(["enhance", "cinematic", "portrait", "vintage"]).default("enhance"),
  video: z.instanceof(File, { message: "Video file is required" })
});

type UploadForm = z.infer<typeof uploadSchema>;

type UploadFormProps = {
  onUploadComplete: () => void;
  onCancel: () => void;
};

export const UploadForm = ({ onUploadComplete, onCancel }: UploadFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      effect: "enhance",
    }
  });

  const onFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      form.setValue("video", file);
    } else {
      form.setValue("video", undefined as any);
    }
  };

  // Add manual progress tracking
  const updateUploadProgress = () => {
    // This is a simplified simulation of upload progress since we can't use onUploadProgress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  };

  const onSubmit = async (data: UploadForm) => {
    if (!user || !selectedFile) return;
    
    setIsUploading(true);
    updateUploadProgress();
    
    try {
      // 1. Create a video record in the database
      const videoId = uuidv4();
      const filePath = `${user.id}/${videoId}/${selectedFile.name}`;
      
      // 2. Upload the file to storage with progress tracking
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
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
        user_id: user.id,
        effect: data.effect
      });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded and is ready for processing.",
      });
      
      onUploadComplete();
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
          name="effect"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Effect Style</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an effect style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="enhance">Enhance (Default)</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="portrait">Portrait Focus</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose how GlowUp AI will process your video
              </FormDescription>
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
                <FileDropzone 
                  selectedFile={selectedFile} 
                  onFileChange={onFileChange} 
                />
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

        <div className="flex justify-end gap-3">
          <GlowUpButton 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isUploading}
          >
            Cancel
          </GlowUpButton>
          <GlowUpButton
            type="submit"
            disabled={isUploading || !selectedFile}
            glowEffect
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </GlowUpButton>
        </div>
      </form>
    </Form>
  );
};
