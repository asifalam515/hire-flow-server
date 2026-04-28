import { AppError } from "@lib/appError";
import { asyncHandler } from "@lib/asyncHandler";
import { jobService } from "./job.service";
// POST /jobs - Create new job (RECRUITER)
export const createJob = asyncHandler(async (req, res) => {
    const { companyId, title, slug, description, requirements, responsibilities, benefits, type, experienceLevel, location, isRemote, country, city, salaryMin, salaryMax, salaryCurrency, salaryPeriod, techStack, status, expiresAt, } = req.body;
    if (!companyId ||
        !title ||
        !slug ||
        !description ||
        !type ||
        !experienceLevel) {
        throw new AppError("companyId, title, slug, description, type, and experienceLevel are required", 400);
    }
    const job = await jobService.createJobInDb({
        companyId,
        title,
        slug,
        description,
        requirements,
        responsibilities,
        benefits,
        type,
        experienceLevel,
        location,
        isRemote,
        country,
        city,
        salaryMin,
        salaryMax,
        salaryCurrency,
        salaryPeriod,
        techStack,
        status,
        expiresAt,
    }, req.user?.id);
    res.status(201).json({
        success: true,
        data: job,
        message: "Job created successfully",
    });
});
// GET /jobs - Search & filter jobs (public)
export const searchAndFilterJobs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const companyId = req.query.companyId || undefined;
    const status = req.query.status || undefined;
    const type = req.query.type || undefined;
    const experienceLevel = req.query.experienceLevel || undefined;
    const isRemote = req.query.isRemote === "true"
        ? true
        : req.query.isRemote === "false"
            ? false
            : undefined;
    const country = req.query.country || undefined;
    const location = req.query.location || undefined;
    const salaryMin = req.query.salaryMin
        ? parseInt(req.query.salaryMin)
        : undefined;
    const salaryMax = req.query.salaryMax
        ? parseInt(req.query.salaryMax)
        : undefined;
    const search = req.query.search || undefined;
    const techStack = req.query.techStack
        ? Array.isArray(req.query.techStack)
            ? req.query.techStack
            : [req.query.techStack]
        : undefined;
    const result = await jobService.getAllJobsFromDb(page, limit, {
        companyId,
        status: status,
        type: type,
        experienceLevel: experienceLevel,
        isRemote,
        country,
        location,
        salaryMin,
        salaryMax,
        search,
        techStack,
    });
    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});
// GET /jobs/:id - Get single job by ID
export const getJobById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await jobService.getJobByIdFromDb(id);
    res.status(200).json({
        success: true,
        data: job,
    });
});
// GET /jobs/slug/:slug - Get single job by slug
export const getJobBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const job = await jobService.getJobBySlugFromDb(slug);
    res.status(200).json({
        success: true,
        data: job,
    });
});
// GET /jobs/company/:companyId - Get jobs by company
export const getJobsByCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await jobService.getJobsByCompanyIdFromDb(companyId, page, limit);
    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});
// GET /jobs/recruiter/my-jobs - Get my posted jobs
export const getMyJobs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await jobService.getJobsByRecruiterIdFromDb(req.user?.id, page, limit);
    res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});
// PATCH /jobs/:id - Update job
export const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, requirements, responsibilities, benefits, type, experienceLevel, location, isRemote, country, city, salaryMin, salaryMax, salaryCurrency, salaryPeriod, techStack, status, expiresAt, slug, } = req.body;
    const updatedJob = await jobService.updateJobInDb(id, req.user?.id, {
        title,
        description,
        requirements,
        responsibilities,
        benefits,
        type,
        experienceLevel,
        location,
        isRemote,
        country,
        city,
        salaryMin,
        salaryMax,
        salaryCurrency,
        salaryPeriod,
        techStack,
        status,
        expiresAt,
        slug,
    });
    res.status(200).json({
        success: true,
        data: updatedJob,
        message: "Job updated successfully",
    });
});
// DELETE /jobs/:id - Delete job
export const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedJob = await jobService.deleteJobFromDb(id, req.user?.id);
    res.status(200).json({
        success: true,
        data: deletedJob,
        message: "Job deleted successfully",
    });
});
export const jobController = {
    createJob,
    searchAndFilterJobs,
    getJobById,
    getJobBySlug,
    getJobsByCompany,
    getMyJobs,
    updateJob,
    deleteJob,
};
//# sourceMappingURL=job.controller.js.map