import { DashboardDto } from '../models';

export interface DashboardService {
  getSummary(): Promise<DashboardDto>;
}

export const DASHBOARD_SERVICE = 'DashboardService';
