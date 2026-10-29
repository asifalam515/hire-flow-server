import {
  findCompaniesRecord,
  findCompanyBySlugRecord,
  ListCompaniesFilter,
  CompanyWithCount,
  CompanyDetail,
} from './companies.repository';

/**
 * List companies with optional search query and limit.
 */
export const listCompanies = async (
  filters: ListCompaniesFilter,
): Promise<CompanyWithCount[]> => {
  return findCompaniesRecord(filters);
};

/**
 * Get company details and published jobs by unique slug.
 */
export const getCompanyBySlug = async (slug: string): Promise<CompanyDetail | null> => {
  return findCompanyBySlugRecord(slug);
};
