import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { uploadProductImage } from '../lib/firestoreService';
import { useTheme } from '../context/ThemeContext';

interface ImageUploaderProps {
  label: string;
  imageUrl: string;
  onImageUploaded: (url: string) => void;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  imageUrl,
  onImageUploaded,
  onClear,
}) => {
  const { getAccentTextClass } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল আপলোড করুন!');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadProductImage(file);
      onImageUploaded(url);
    } catch (error) {
      console.error(error);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <label className="text-slate-500 block font-bold">{label}</label>
      
      {imageUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group aspect-video">
          <img 
            src={imageUrl} 
            alt="Uploaded Preview" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onClear}
              className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full shadow-md active:scale-95 transition-all"
              title="মুছে ফেলুন"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {isUploading ? (
            <div className="space-y-2 py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent mx-auto"></div>
              <p className="text-[11px] text-slate-500">আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
            </div>
          ) : (
            <div className="space-y-1.5 py-1">
              <Upload className={`h-6 w-6 mx-auto text-slate-400 ${getAccentTextClass()}`} />
              <p className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                ক্লিক করুন অথবা ফাইল ড্র্যাগ করে এখানে ড্রপ করুন
              </p>
              <p className="text-[10px] text-slate-400">PNG, JPG, WEBP (সর্বোচ্চ ৫ MB)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface GalleryUploaderProps {
  label: string;
  images: string[];
  onImagesChanged: (images: string[]) => void;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  label,
  images,
  onImagesChanged,
}) => {
  const { getAccentTextClass } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadProductImage(file);
      onImagesChanged([...images, url]);
    } catch (error) {
      console.error(error);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChanged(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2 text-xs">
      <label className="text-slate-500 block font-bold">{label}</label>
      
      <div className="grid grid-cols-4 gap-2.5">
        {images.map((img, idx) => (
          <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 aspect-video group">
            <img 
              src={img} 
              alt={`Gallery Preview ${idx + 1}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full shadow-md active:scale-95 transition-all opacity-0 group-hover:opacity-100"
              title="মুছে ফেলুন"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg aspect-video">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg aspect-video text-slate-400 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">যোগ করুন</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </button>
        )}
      </div>
    </div>
  );
};
