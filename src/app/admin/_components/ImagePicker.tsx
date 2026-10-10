"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { uploadPhoto } from "../actions";
import { shrinkImage } from "./shrink-image";
import { Spinner } from "./ui";

/** Shows a photo with "Upload / Change / Remove". Uploads right away; saved with the form. */
export function ImagePicker({
  value,
  onChange,
  onError,
  placeholder = "📷",
  aspect = "aspect-square",
  allowRemove = true,
}: {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
  onError: (message: string) => void;
  placeholder?: string;
  aspect?: string;
  allowRemove?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      let small: File;
      try {
        small = await shrinkImage(file);
      } catch {
        onError("Could not read this photo. Please choose a JPG or PNG photo.");
        return;
      }
      const form = new FormData();
      form.append("file", small);
      const result = await uploadPhoto(form);
      if (result.ok && result.url) onChange(result.url);
      else if (!result.ok) onError(result.error);
    } catch {
      onError("Upload failed. Please check your internet and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className={`relative overflow-hidden rounded-xl border border-line bg-soft ${aspect}`}>
        {value ? (
          <Image src={value} alt="" fill sizes="300px" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-center text-3xl opacity-60">
            <span>
              {placeholder}
              <span className="mt-1 block text-xs font-medium text-muted">No photo</span>
            </span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/80 text-sm font-semibold text-ink">
            <span className="flex items-center gap-2">
              <Spinner className="text-brand-600" /> Uploading…
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <label
          htmlFor={inputId}
          className={`flex-1 cursor-pointer rounded-lg border border-line bg-white px-3 py-2 text-center text-xs font-bold text-ink hover:border-brand-200 hover:text-brand-700 ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {value ? "Change photo" : "Upload photo"}
        </label>
        {value && allowRemove && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => onChange(undefined)}
            className="rounded-lg px-2 py-2 text-xs font-bold text-muted hover:bg-white hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
