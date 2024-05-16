import { Roles } from '@/common/decorators';
import { UserRole } from '@/core/models';
import { DASHBOARD_SERVICE, DashboardService } from '@/core/services';
import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';

@Controller('/admin/dashboard')
@Roles(UserRole.ADMIN, UserRole.OWNER)
export class DashboardController {
  constructor(
    @Inject(DASHBOARD_SERVICE) private dashboardService: DashboardService,
  ) {}

  @Get('summary')
  async getSummary() {
    return await this.dashboardService.getSummary();
  }

  @Get('enrollments/:year')
  async getMonthlyEnrollments(@Param('year', ParseIntPipe) year: number) {
    return await this.dashboardService.getMonthlyEnrollments(year);
  }
}
