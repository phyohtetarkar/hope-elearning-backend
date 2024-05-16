export class MonthlyEnrollmentDto {
  data: { [key: string]: number };

  constructor(partial: Partial<MonthlyEnrollmentDto> = {}) {
    Object.assign(this, partial);
  }
}
