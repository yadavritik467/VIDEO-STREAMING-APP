import { videoQueue } from "../services/videoQueue.js";

export const clearAllJobs = async (req, res) => {
  try {
    // Remove all jobs in all states
    await videoQueue.drain(); // Removes waiting/delayed jobs
    await videoQueue.clean(0, 1000, "completed"); // Remove completed
    await videoQueue.clean(0, 1000, "failed"); // Remove failed
    await videoQueue.clean(0, 1000, "wait"); // Just in case
    await videoQueue.clean(0, 1000, "active"); // Force clean active if needed
    await videoQueue.obliterate({ force: true }); // Optional: FULL cleanup including active

    return res.send("🧹 All jobs cleared from queue.");
  } catch (error) {
    console.error("❌ Error clearing jobs:", error);
    return res.status(500).send("Error clearing jobs");
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await videoQueue.getJobs([
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    ]);

    const jobList = jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      status: job.finishedOn
        ? "completed"
        : job.failedReason
        ? "failed"
        : "in-progress",
    }));

    return res.json({ message: "Worker status fetched", jobs: jobList });
  } catch (error) {
    console.error("work fail", error);
    return res.status(500).json({ message: "Failed to fetch job info" });
  }
};
