import { Request, Response } from 'express';
import * as companiesService from './companies.service';

export const listCompaniesController = async (req: Request, res: Response) => {
  const { search, limit } = req.query;
  
  const filters: { search?: string; limit?: number } = {};
  if (typeof search === 'string') {
    filters.search = search;
  }
  if (typeof limit === 'string') {
    filters.limit = parseInt(limit, 10);
  }

  const companies = await companiesService.listCompanies(filters);

  res.status(200).json({
    success: true,
    data: companies,
  });
};

export const getCompanyBySlugController = async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ success: false, message: 'Valid slug is required' });
    return;
  }

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
