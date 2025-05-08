
import React from "react";
import { UploadCloud, X } from "lucide-react";

type FileDropzoneProps = {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
};

export const FileDropzone = ({ selectedFile, onFileChange }: FileDropzoneProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const clearSelectedFile = () => {
    onFileChange(null);
  };

  if (!selectedFile) {
    return (
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
            onChange={handleFileChange}
          />
        </label>
      </div>
    );
  }

  return (
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
  );
};
