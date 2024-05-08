import { DASHBOARD_SERVICE, DashboardService } from '@/core/services';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('/admin/dashboard')
export class DashboardController {
  constructor(
    @Inject(DASHBOARD_SERVICE) private dashboardService: DashboardService,
  ) {}

  @Get()
  async getSummary() {
    return await this.dashboardService.getSummary();
  }
}
