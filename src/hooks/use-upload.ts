"use client";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { useRef, useState } from "react";

export default function useUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result;
      setLoading(true);

      try {
        const response = await axios.post<ApiResponse<string>>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
          JSON.stringify({ file: base64String })
        );
        const data = response.data;
        if (data.url) {
          setImageUrl(data.url);
          
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        console.error("Image upload failed", error);
      } finally {
        setLoading(false);
      }
    };
  };

  const handleImageUrl = async (url: string) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse<string>>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload?imageUrl=` + url
      );
      const data = response.data;
      if (data.url) {
        setImageUrl(data.url);
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error("Failed to fetch image by URL", error);
    } finally{
      setLoading(false);
    }
  };

  return { loading, imageUrl, fileInputRef, handleFileUpload, handleImageUrl };
}

