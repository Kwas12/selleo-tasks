"use client";

import { useAppContext } from "../app/AppContext";

export default function NewDirectory() {
  const {
    newDirectory,
    setNewDirectory,
    handleAddDirectory,
    role,
    handleSetRole,
  } = useAppContext();

  return (
    <div className="w-full min-h-16 bg-slate-300 mb-6 rounded-xl flex flex-row flex-wrap ">
      <div className="flex flex-row flex-wrap ">
        <input
          type="text"
          onChange={(e) => setNewDirectory!(e.target.value)}
          value={newDirectory}
          className="mx-4 my-2 rounded-xl px-2 text-gray-800"
          placeholder="New Directory..."
        />
        <button
          onClick={() => handleAddDirectory!()}
          className="bg-white mx-4 my-2 px-4 rounded-xl text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Add Directory
        </button>
      </div>
      <div className="flex flex-row flex-wrap ">
        <select
          id="countries"
          onChange={(e) => handleSetRole!(e.target.value)}
          defaultValue={"user"}
          className="bg-gray-50 border my-2 px-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="user" selected={role === "user"}>
            User
          </option>
          <option value="admin" selected={role === "admin"}>
            Admin
          </option>
        </select>
      </div>
    </div>
  );
}
