import { Request, Response } from 'express';
import { JobsService } from './jobs.service';
import { AppError } from '../../utils/AppError';

// ---------------------------------------------------------------------------
// Jobs Controller
// ---------------------------------------------------------------------------
// Handles HTTP request/response formatting, extracts user context, and
// delegates logic to JobsService.
// ---------------------------------------------------------------------------

export class JobsController {
  private readonly jobsService: JobsService;

  constructor(jobsService: JobsService = new JobsService()) {
    this.jobsService = jobsService;
  }

  private extractJobId(req: Request): string {
    const rawJobId = req.params.id;
    const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;
    if (typeof jobId !== 'string' || !jobId) {
      throw new AppError('Job ID parameter is required and must be a valid string.', 400);
    }
    return jobId;
  }

  /**
   * POST /api/v1/jobs
   */
  public createJob = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const job = await this.jobsService.createJob(req.user, req.body);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job },
    });
  };

  /**
   * PATCH /api/v1/jobs/:id
   */
  public updateJob = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const jobId = this.extractJobId(req);
    const job = await this.jobsService.updateJob(req.user, jobId, req.body);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: { job },
    });
  };

  /**
   * DELETE /api/v1/jobs/:id
   */
  public deleteJob = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const jobId = this.extractJobId(req);
    await this.jobsService.deleteJob(req.user, jobId);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  };

  /**
   * GET /api/v1/jobs/:id
   */
  public getJobById = async (req: Request, res: Response): Promise<void> => {
    const jobId = this.extractJobId(req);
    const job = await this.jobsService.getJobById(jobId);

    res.status(200).json({
      success: true,
      data: { job },
    });
  };

  /**
   * GET /api/v1/jobs
   * Marketplace listing with optional GIN full-text search (`?search=...`).
   */
  public listJobs = async (req: Request, res: Response): Promise<void> => {
    // req.query is validated and formatted by validateRequest(listJobsSchema)
    const result = await this.jobsService.listJobs(req.query as any, req.user);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  /**
   * GET /api/v1/jobs/company/my-jobs
   * Strictly isolated listing for a recruiter's own company.
   */
  public listMyCompanyJobs = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.companyId) {
      throw new AppError('You must belong to a company to access company jobs.', 403);
    }

    const result = await this.jobsService.listJobs(
      req.query as any,
      req.user,
      { myCompanyOnly: true },
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  /**
   * POST /api/v1/jobs/:id/save
   * Toggle saving a job for later for a candidate.
   */
  public toggleSaveJob = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const jobId = this.extractJobId(req);
    const result = await this.jobsService.toggleSaveJob(req.user.id, jobId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: { saved: result.saved },
    });
  };

  /**
   * GET /api/v1/jobs/saved/me
   * List all saved jobs for the currently authenticated candidate.
   */
  public listSavedJobs = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const savedJobs = await this.jobsService.listSavedJobs(req.user.id);

    res.status(200).json({
      success: true,
      data: { savedJobs },
    });
  };
}
