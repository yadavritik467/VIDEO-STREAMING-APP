import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import HLSPlayer from "./HLSPlayer";

function Home() {
  const [file, setFile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append("video", file);

      const res = await axios.post("http://localhost:4500/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const fetchVideo = async () => {
    try {
      const id = "98a585f3234f268f8203bafb9279f923";
      setVideoId(id);
      const infoRes = await axios.get(
        `http://localhost:4500/videos/${id}/info`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>🎬 Upload & Stream Video (HLS)</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: 20 }}
      />

      <button onClick={handleUpload} style={{ padding: 10, marginBottom: 10 }}>
        Upload & Transcode
      </button>

      {uploadProgress > 0 && <p>Uploading: {uploadProgress}%</p>}

      <HLSPlayer
        src={`http://localhost:4500/videos/98a585f3234f268f8203bafb9279f923/720.m3u8`}
      />
    </div>
  );
}

export default Home;
