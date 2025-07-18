import { Worker } from "bullmq";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const startWorker = (__dirname, __filename) => {
  console.log("start working");
  const worker = new Worker(
    "video-transcode",
    async (job) => {
      console.log("🎥 Got job:", job.name, job.data);
      const { inputPath, filename } = job.data;
      const outputDir = path.join(
        __dirname,
        "processed",
        filename.split(".")[0]
      );
      fs.mkdirSync(outputDir, { recursive: true });

      //   const resolutions = [720, 480];
      const resolutions = [480];
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

        // ✅ Delete the input file after successful transcoding

        if (fs.existsSync(`./uploads/${filename}`)) {
          fs.unlinkSync(`./uploads/${filename}`); // executes ONLY after all transcode calls finish
        }
        console.log(`✅ Transcoding done for ${filename}`);
      } catch (err) {
        console.error("❌ Transcoding failed:", err);
      }
    },
    {
      connection: {
        host: "redis-16928.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 16928,
        username: "default",
        password: "mp4QjhFgn1dHiMGx6kK6xlesY8qYn09A",
      },
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err);
  });
};
