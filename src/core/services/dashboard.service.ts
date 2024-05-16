import { MonthlyEnrollmentDto, SummaryDto } from '../models';

export interface DashboardService {
  getSummary(): Promise<SummaryDto>;

  getMonthlyEnrollments(year: number): Promise<MonthlyEnrollmentDto>;
}

export const DASHBOARD_SERVICE = 'DashboardService';
