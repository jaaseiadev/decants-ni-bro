"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}

export function PhotoUpload({ value, onChange, onError }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName; // Upload directly to the bucket

      const { error: uploadError } = await supabase.storage
        .from('perfume-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('perfume-images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (err: any) {
      console.error(err);
      onError(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative aspect-[4/5] w-full group overflow-hidden bg-gray-50 border border-gray-200">
          <img 
            src={preview} 
            alt="Perfume preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearPhoto}
              className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform"
              title="Remove photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-[4/5] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-ds-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-ds-taupe">
              <div className="w-8 h-8 border-2 border-ds-charcoal border-t-transparent rounded-full animate-spin" />
              <span className="font-sans text-xs uppercase tracking-widest font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-ds-taupe group-hover:text-ds-black transition-colors">
              <UploadCloud className="w-10 h-10" />
              <div className="text-center font-sans">
                <p className="text-sm font-medium uppercase tracking-widest">Upload Photo</p>
                <p className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
}