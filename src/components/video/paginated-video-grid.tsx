
import React, { useState } from "react";
import { Video } from "@/utils/videoUtils";
import { VideoGrid } from "./video-grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginatedVideoGridProps = {
  videos: Video[];
  onProcess: (video: Video) => void;
  onShare: (video: Video) => void;
  onView: (video: Video) => void;
  itemsPerPage?: number;
};

export const PaginatedVideoGrid = ({
  videos,
  onProcess,
  onShare,
  onView,
  itemsPerPage = 6
}: PaginatedVideoGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVideos = videos.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <p>No videos in this category</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <VideoGrid 
        videos={currentVideos} 
        onProcess={onProcess} 
        onShare={onShare} 
        onView={onView} 
      />
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <span className="text-sm px-2">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
