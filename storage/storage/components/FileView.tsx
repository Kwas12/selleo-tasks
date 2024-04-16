"use client";

export default function FileView({ fileSrc }: { fileSrc: string }) {
  return (
    <iframe
      src={`https://docs.google.com/viewer?url=${fileSrc}&embedded=true`}
      className="w-11/12 h-5/6"
    ></iframe>
  );
}
