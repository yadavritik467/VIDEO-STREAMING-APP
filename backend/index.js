import express from "express";
import cors from "cors";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
import { videoQueue } from "./services/videoQueue.js";
import { startWorker } from "./services/worker.js";
import { clearAllJobs, getAllJobs } from "./utils/utils.js";

ffmpeg.setFfmpegPath("D:/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 4500;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Serve processed HLS files
app.use("/videos", express.static(path.join(__dirname, "processed/sample")));

// Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Upload + Transcode Route
// app.post("/upload", upload.single("video"), async (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(400).send("No file uploaded");

//   const inputPath = path.join(__dirname, file.path);
//   const outputDir = path.join(__dirname, "processed", file.filename);
//   fs.mkdirSync(outputDir, { recursive: true });

//   const resolutions = [720,480];
//   const outputInfo = [];

//   const transcode = (resVal) => {
//     return new Promise((resolve, reject) => {
//       const outPath = path.join(outputDir, `${resVal}.m3u8`);
//       ffmpeg(inputPath)
//         .outputOptions([
//           "-preset veryfast",
//           "-g 48",
//           "-sc_threshold 0",
//           `-s hd${resVal}`,
//           "-c:a aac",
//           "-ar 48000",
//           "-b:a 128k",
//           "-c:v h264",
//           `-b:v ${resVal}k`,
//           "-hls_time 10",
//           "-hls_playlist_type vod",
//           "-hls_segment_filename",
//           path.join(outputDir, `${resVal}_%03d.ts`),
//         ])
//         .output(outPath)
//         .on("end", () => {
//           outputInfo.push(`${resVal}`);
//           resolve();
//         })
//         .on("error", reject)
//         .run();
//     });
//   };

//   try {
//     for (let r of resolutions) {
//       await transcode(r);
//     }
//     fs.unlinkSync(inputPath); // cleanup
//     res.json({ id: file.filename });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Transcoding failed");
//   }
// });

// Get transcoded video info
app.get("/videos", (req, res) => {
  // const { id } = req.params;
  const videoDir = path.join(__dirname, "processed/sample");
  if (!fs.existsSync(videoDir))
    return res.status(404).json({ error: "Not found" });

  const files = fs.readdirSync(videoDir);
  const resolutions = files
    .filter((f) => f.endsWith(".m3u8"))
    .map((f) => f.replace(".m3u8", ""));

  return res.json({ id, resolutions });
});

const CHUNKS_DIR = "./chunks";
app.post("/upload/chunk", upload.single("file"), (req, res) => {
  const {
    file,
    body: { filename,totalChunks, currentChunk },
  } = req;

  const chunkFilename = `${file.originalname}.${currentChunk}`;
  const chunkPath = `${CHUNKS_DIR}/${chunkFilename}`;

  console.log(
    "Chunk received:",
    req.body.currentChunk,
    "/",
    req.body.totalChunks
  );
  fs.rename(file.path, chunkPath, async (err) => {
    if (err) {
      console.error("Error moving chunk file:", err);
      return res.status(500).send("Error uploading chunk");
    } else {
      if (+currentChunk === +totalChunks) {
        // All chunks have been uploaded, assemble them into a single file
        assembleChunks(filename,file.originalname, totalChunks)
          .then(() => res.send("File uploaded successfully"))
          .catch((err) => {
            console.error("Error assembling chunks:", err);
            res.status(500).send("Error assembling chunks");
          });
      } else {
        res.send("Chunk uploaded successfully");
      }
    }
  });
});

async function assembleChunks(filename,originalname, totalChunks) {
  const outputPath = `./uploads/${filename}`;

  // Safety: delete if already exists
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = `${CHUNKS_DIR}/${originalname}.${i}`;
    if (!fs.existsSync(chunkPath)) {
      console.error("Missing chunk:", chunkPath);
      throw new Error(`Missing chunk ${i}`);
    }

    const reader = fs.createReadStream(chunkPath);
    const writer = fs.createWriteStream(outputPath, { flags: "a" }); // ✅ fresh writer with append

    await pipeline(reader, writer);

    fs.unlink(chunkPath, (err) => {
      if (err) {
        console.error("Error deleting chunk file:", err);
      }
    });
  }

  try {
    const que = await videoQueue.add("transcode", {
      filename,
      inputPath: outputPath,
    });
    console.log("✅ added in work que: ", que);
  } catch (error) {
    console.log("err in adding wokr", error);
  }

  console.log("✅ File assembled:", outputPath);
}

app.get("/clear-jobs", clearAllJobs);

app.get("/get-jobs",getAllJobs);

app.get("/run-worker", (req, res) => {
  try {
    startWorker(__dirname,__filename)

    return res.send("work started");
  } catch (error) {
    console.log("work fail", error);
    return res.send("work failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
