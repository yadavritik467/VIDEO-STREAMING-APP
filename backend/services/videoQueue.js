import { Queue } from "bullmq";

export const videoQueue = new Queue("video-transcode", {
  connection: {
    host: "redis-16928.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 16928,
    username: "default",
    password: "mp4QjhFgn1dHiMGx6kK6xlesY8qYn09A"
  },
   defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: { count: 3 },
  },
});
