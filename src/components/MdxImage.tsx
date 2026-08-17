import React from "react";

interface MdxImageProps {
  src?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

export default function MdxImage({ src, alt, title, width, height }: MdxImageProps) {
  if (!src) return null;

  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt || ""}
        title={title}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="rounded-lg border border-slate-800 w-full h-auto"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-slate-500 font-mono">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
