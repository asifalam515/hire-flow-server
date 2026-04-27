import { prisma } from "../../../lib/prisma";

const getAllJobsFromDb = async () => {
  const jobs = await prisma.job.findMany();
  return jobs;
};
const getJobByIdFromDb = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
  });
  return job;
};
const getJobsByCompanyIdFromDb = async (companyId: string) => {
  const jobs = await prisma.job.findMany({
    where: { companyId },
  });
  return jobs;
};
const updateJobInDb = async (id: string, jobData: any) => {
  const updatedJob = await prisma.job.update({
    where: { id },
    data: jobData,
  });
  return updatedJob;
};
const deleteJobFromDb = async (id: string) => {
  const deletedJob = await prisma.job.delete({
    where: { id },
  });
  return deletedJob;
};
const postJobToDb = async (jobData: any) => {
  const newJob = await prisma.job.create({
    data: {
      ...jobData,
      recruiter: ,
    },
  });
  return newJob;
};

export const jobService = {
  postJobToDb,
  getAllJobsFromDb,
  getJobByIdFromDb,
  getJobsByCompanyIdFromDb,
  updateJobInDb,
  deleteJobFromDb,
};
