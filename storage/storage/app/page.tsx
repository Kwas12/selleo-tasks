"use client";
import FileView from "../components/FileView";
import FileList from "../components/FileList";
import { useState } from "react";
import { useAppContext } from "./AppContext";
import NewDirectory from "@/components/NewDirectory";
import VideoView from "@/components/VideoView";

export default function Home() {
  const { handleGetFiles, directory, handleSetDirectory, role } =
    useAppContext();

  const [viewierIsOpen, setViewierIsOpen] = useState(false);

  const handleSetViewierIsOpen = () => {
    setViewierIsOpen((prev) => !prev);
  };

  const handleAddFile = async (files: any) => {
    sendFile(files.files);
  };

  const dropHandler = (ev: any) => {
    ev.preventDefault();
    sendFile(ev.dataTransfer.files);
  };

  const dragOverHandler = (ev: any) => {
    ev.preventDefault();
  };

  const sendFile = async (files: File[]) => {
    const formData = new FormData();
    Object.values(files).forEach((file) => {
      formData.append("files", file);
    });

    formData.append("folderName", directory!.join("/"));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
          headers: { role: role! },
        }
      );

      await handleGetFiles!();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8">
      <div
        className={`w-full h-full top-0 flex flex-col items-center justify-center ${
          viewierIsOpen ? "" : "hidden"
        } absolute bg-slate-500 bg-opacity-50`}
      >
        <div className="w-11/12 flex flex-row justify-end">
          <button
            className="w-20 text-white font-bold text-3xl"
            onClick={handleSetViewierIsOpen}
          >
            X
          </button>
        </div>
        <FileView fileSrc="" />
      </div>
      <NewDirectory />
      <div className="flex items-center justify-center w-full">
        <label
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Any File (25MB Max)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            className="hidden"
            onChange={(event) =>
              handleAddFile(
                (event.target as any) != null ? (event.target as any) : null
              )
            }
          />
        </label>
      </div>
      <div className="w-full text-left pl-4 pt-4 flex flex-row">
        <h3 className="text-4xl">{directory!.join("/").replace("//", "/")}</h3>
        <button
          className="text-4xl ml-4 px-2 bg-slate-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-20"
          onClick={() => handleSetDirectory!("back", "")}
          disabled={directory!.length < 2}
        >
          {"<"}-
        </button>
      </div>
      <FileList />
      <VideoView />
    </main>
  );
}
