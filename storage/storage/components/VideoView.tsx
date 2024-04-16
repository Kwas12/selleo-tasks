"use client";

import { useAppContext } from "@/app/AppContext";

export default function VideoView() {
  const { videoId, handleSetVideoId } = useAppContext();

  return videoId != null && videoId.length > 0 ? (
    <div
      className={`w-full h-full top-0 flex flex-col items-center justify-center absolute bg-slate-500 bg-opacity-50`}
    >
      <div className="w-11/12 flex flex-row justify-end">
        <button
          className="w-20 text-white font-bold text-3xl"
          onClick={() => handleSetVideoId!("")}
        >
          X
        </button>
      </div>
      <video className="h-5/6" id="videoPlayer" controls autoPlay>
        <source
          src={`${process.env.NEXT_PUBLIC_API_URL}/stream/${videoId}`}
          // type="video/mp4"
        />
      </video>
    </div>
  ) : null;
}
