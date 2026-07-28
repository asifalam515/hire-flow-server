import { Router } from 'express';
import { listCompaniesController, getCompanyBySlugController } from './companies.controller';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(listCompaniesController));
router.get('/:slug', catchAsync(getCompanyBySlugController));

export const companiesRoutes = router;
