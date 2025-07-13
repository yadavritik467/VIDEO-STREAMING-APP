import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import HLSPlayer from "../HLSPlayer";

function Upload() {
  const [file, setFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunksItems, setTotalChunksItem] = useState(0);
  const [actualPercentage, setActualPercentage] = useState(0);

  async function uploadChunk(chunk, totalChunks, currentChunk) {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("totalChunks", totalChunks);
    formData.append("currentChunk", currentChunk);
    const response = await fetch("http://localhost:4500/upload/chunk", {
      method: "POST",
      body: formData,
    });
    setUploadProgress((p) => p + 1);

    if (!response.ok) {
      throw new Error("Chunk upload failed");
    }
  }

  useEffect(() => {
    const percentage =
      Math.floor((uploadProgress * 100) / totalChunksItems) * 1;
    setActualPercentage(percentage);
  }, [uploadProgress]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setUploadProgress(0);
      // console.log('file',file)
      const chunkSize = 1024 * 1024; // 1MB
      const totalChunks = Math.ceil(file.size / chunkSize); //104
      setTotalChunksItem(totalChunks);
      console.log("totalChunks", totalChunks);
      let startByte = 0;

      for (let i = 1; i <= totalChunks; i++) {
        const endByte = Math.min(startByte + chunkSize, file.size);
        const chunk = file.slice(startByte, endByte);
        await uploadChunk(chunk, totalChunks, i);
        startByte = endByte;
      }
      console.log("upload completed");
    } catch (error) {
      console.error("Upload error:", error);
    }
    // =====================> this commented code is working from here
    // try {
    //   setUploadProgress(0);
    //   const formData = new FormData();
    //   formData.append("video", file);
    //   const res = await axios.post("http://localhost:4500/upload", formData, {
    //     onUploadProgress: (progressEvent) => {
    //       const percent = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total
    //       );
    //       setUploadProgress(percent);
    //     },
    //   });
    // } catch (err) {
    //   console.error("Upload error:", err);
    // }
    // =====================> this commented code is working to here
  };

  const fetchVideo = async () => {
    console.clear();
    // try {
    //   const id = "98a585f3234f268f8203bafb9279f923";
    //   setVideoId(id);
    //   const infoRes = await axios.get(
    //     `http://localhost:4500/videos/${id}/info`
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <div style={{ width: "100%", padding: 0, fontFamily: "sans-serif" }}>
      <form onSubmit={handleUpload} action="">
        <h2>🎬 Upload & Stream Video (HLS)</h2>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: 20 }}
        />

        <button type="submit" style={{ padding: 10, marginBottom: 10 }}>
          Upload & Transcode
        </button>
      </form>

      {uploadProgress > 0 && <p>Uploading: {actualPercentage}%</p>}

      <HLSPlayer
        src={`http://localhost:4500/videos/98a585f3234f268f8203bafb9279f923/720.m3u8`}
      />
    </div>
  );
}

export default Upload;
