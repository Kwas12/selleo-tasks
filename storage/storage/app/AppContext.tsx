"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import getFiles from "./GetFiles";
import addNewDirectory from "./AddNewDirectory";
import downloadFile from "./DownloadFile";

const AppContext = createContext<{
  files?: {
    name: string;
    isDirectory: boolean;
    id: string;
    mimetype: string;
  }[];
  handleGetFiles?: Function;
  responseNewDirectory?: string;
  handleAddDirectory?: Function;
  newDirectory?: string;
  setNewDirectory?: Function;
  directory?: string[];
  handleSetDirectory?: Function;
  handleDownloadFile?: Function;
  handleAddFiles?: Function;
  role?: "user" | "admin";
  handleSetRole?: Function;
  errorFiles?: Error;
  videoId?: string;
  handleSetVideoId?: Function;
}>({});

export const AppProvider = ({ children }: { children: any }) => {
  const [directory, setDirectory] = useState(["/"]);
  const [newDirectory, setNewDirectory] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [videoId, setVideoId] = useState<string>("");
  const directoryRef = useRef(["/"]);
  const {
    data: files,
    refetch: handleGetFiles,
    error: errorFiles,
  } = useQuery({
    queryKey: ["files"],
    queryFn: () => getFiles(directoryRef.current.join("/"), role),
  });

  const handleAddDirectory = async () => {
    await addNewDirectory(newDirectory, directoryRef.current.join("/"), role);
    setNewDirectory("");
    handleGetFiles();
  };

  const handleSetDirectory = async (
    operation: "open" | "back",
    directoryName: string
  ) => {
    if (operation === "open") {
      setDirectory((prev) => [...prev, directoryName]);
      directoryRef.current = [...directoryRef.current, directoryName];
    } else {
      if (directory.length < 2) {
        return;
      }
      const newDirectory = directory;
      newDirectory.pop();
      setDirectory((prev) => newDirectory);
      directoryRef.current = newDirectory;
    }
    handleGetFiles();
  };

  const handleSetRole = (role: "user" | "admin") => {
    setRole(role);
  };

  const handleDownloadFile = async (id: string) => {
    const file = await downloadFile(id, role);

    console.log(file);
    const uint8 = new Uint8Array(file.file.data);
    const blob = new Blob([uint8], { type: file.type });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
  };

  const handleSetVideoId = (id: string) => {
    setVideoId(id);
  };

  const value = {
    files,
    handleGetFiles,
    handleAddDirectory,
    newDirectory,
    setNewDirectory,
    directory,
    handleSetDirectory,
    handleDownloadFile,
    role,
    handleSetRole,
    errorFiles,
    videoId,
    handleSetVideoId,
  };

  return (
    <AppContext.Provider value={value as any}>{children}</AppContext.Provider>
  );
};
// Export the context
export const useAppContext = () => useContext(AppContext);
