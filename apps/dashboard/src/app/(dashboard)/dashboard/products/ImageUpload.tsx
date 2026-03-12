"use client";
import { useState } from "react";

export function ImageUpload({ productId, hasImage }: { 
  productId: string; 
  hasImage: boolean 
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, image: base64 }),
      });

      if (res.ok) {
        setDone(true);
        setTimeout(() => window.location.reload(), 500);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <label className="mt-2 block cursor-pointer text-xs text-blue-500 underline">
      {loading ? "Saving..." : done ? "✅ Saved!" : hasImage ? "Change Image" : "➕ Add Image"}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleChange} 
        disabled={loading} 
      />
    </label>
  );
}