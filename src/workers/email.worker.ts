import { Worker } from "bullmq";
import { connection } from "../config/bullmq.js";
import { sendMail } from "../config/nodemailer.js";

const worker = new Worker(
  "email",
  async (job) => {
    const {emailStr,htmlContent} = job.data
    let email:string = emailStr.toString();
    let html:string = htmlContent.toString();
    console.log("Processing job:", job.id);

    await sendMail(email, html);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed`, err);
});
