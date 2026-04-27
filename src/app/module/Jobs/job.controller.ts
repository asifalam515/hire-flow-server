import { type Request, type Response } from "express";
import { jobService } from "./job.service";

const postJob = async (req: Request, res: Response) => {
  const newJob = await jobService.postJobToDb(req.body);
  res.status(201).json({
    success: true,
    data: newJob,
    message: "Job posted successfully",
  });
};
