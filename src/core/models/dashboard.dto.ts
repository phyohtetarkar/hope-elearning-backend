export class DashboardDto {
  courseCount: number;
  postCount: number;
  subscriberCount: number;
  userCount: number;
  monthlyEnrollments: { [key: string]: number };
  enrolledByLevel: { [key: string]: number };

  constructor(partial: Partial<DashboardDto> = {}) {
    Object.assign(this, partial);
  }
}
