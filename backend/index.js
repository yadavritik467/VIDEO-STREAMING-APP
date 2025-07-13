import express from "express";
import cors from "cors";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

ffmpeg.setFfmpegPath("D:/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 4500;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Serve processed HLS files
app.use("/videos", express.static(path.join(__dirname, "processed")));

// Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Upload + Transcode Route
app.post("/upload", upload.single("video"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join(__dirname, file.path);
  const outputDir = path.join(__dirname, "processed", file.filename);
  fs.mkdirSync(outputDir, { recursive: true });

  const resolutions = [720,480];
  const outputInfo = [];

  const transcode = (resVal) => {
    return new Promise((resolve, reject) => {
      const outPath = path.join(outputDir, `${resVal}.m3u8`);
      ffmpeg(inputPath)
        .outputOptions([
          "-preset veryfast",
          "-g 48",
          "-sc_threshold 0",
          `-s hd${resVal}`,
          "-c:a aac",
          "-ar 48000",
          "-b:a 128k",
          "-c:v h264",
          `-b:v ${resVal}k`,
          "-hls_time 10",
          "-hls_playlist_type vod",
          "-hls_segment_filename",
          path.join(outputDir, `${resVal}_%03d.ts`),
        ])
        .output(outPath)
        .on("end", () => {
          outputInfo.push(`${resVal}`);
          resolve();
        })
        .on("error", reject)
        .run();
    });
  };

  try {
    for (let r of resolutions) {
      await transcode(r);
    }
    fs.unlinkSync(inputPath); // cleanup
    res.json({ id: file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).send("Transcoding failed");
  }
});

// Get transcoded video info
app.get("/videos/:id/info", (req, res) => {
  const { id } = req.params;
  const videoDir = path.join(__dirname, "processed", id);
  if (!fs.existsSync(videoDir))
    return res.status(404).json({ error: "Not found" });

  const files = fs.readdirSync(videoDir);
  const resolutions = files
    .filter((f) => f.endsWith(".m3u8"))
    .map((f) => f.replace(".m3u8", ""));

  return res.json({ id, resolutions });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
