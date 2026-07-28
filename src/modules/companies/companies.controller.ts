import { Request, Response } from 'express';
import * as companiesService from './companies.service';

export const listCompaniesController = async (req: Request, res: Response) => {
  const { search, limit } = req.query;
  const companies = await companiesService.listCompanies({
    search: search as string,
    limit: limit ? parseInt(limit as string) : undefined
  });

  res.status(200).json({
    success: true,
    data: companies,
  });
};

export const getCompanyBySlugController = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = await companiesService.getCompanyBySlug(slug);

  if (!company) {
    res.status(404).json({ success: false, message: 'Company not found' });
    return;
  }

  res.status(200).json({
    success: true,
    data: company,
  });
};
