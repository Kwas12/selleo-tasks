"use client";

import { useAppContext } from "../app/AppContext";
import DirectoryIcon from "./DirectoryIcon";
import DownloadIcon from "./DownloadIcon";
import FileIcon from "./FileIcon";
import PlayIcon from "./PlayIcon";

export default function FileList() {
  const { files, handleSetDirectory, handleDownloadFile, handleSetVideoId } =
    useAppContext();

  return (
    <div className="w-full min-h-16 bg-slate-300 mt-6 rounded-xl flex flex-row flex-wrap ">
      {(files as unknown as { statusCode: number })?.statusCode != null
        ? null
        : files?.map((file) => (
            <div
              className=" relative w-32 h-32 p-2 flex flex-col items-center justify-center bg-slate-50 m-2 rounded-lg hover:bg-gray-100 transition-colors"
              key={file.id}
              onClick={
                file.isDirectory
                  ? () => handleSetDirectory!("open", file.name)
                  : undefined
              }
            >
              <div className="absolute top-1 right-1 flex flex-row ">
                {console.log(file.mimetype) != null}
                {file.mimetype === "video/mp4" ||
                file.mimetype === "video/ogg" ||
                file.mimetype === "video/webm" ||
                file.mimetype === "audio/ogg" ||
                file.mimetype === "audio/mpeg" ||
                file.mimetype === "audio/mp4" ||
                file.mimetype === "audio/webm" ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSetVideoId!(file.id)}
                  >
                    <PlayIcon />
                  </div>
                ) : null}
                {file.isDirectory ? null : (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleDownloadFile!(file.id)}
                  >
                    <DownloadIcon />
                  </div>
                )}
              </div>
              {file.isDirectory ? <DirectoryIcon /> : <FileIcon />}
              <h3
                className="w-full text-gray-800 text-center h-1/3 text-ellipsis overflow-hidden whitespace-nowrap"
                title={file.name}
              >
                {file.name}
              </h3>
            </div>
          ))}
    </div>
  );
}
