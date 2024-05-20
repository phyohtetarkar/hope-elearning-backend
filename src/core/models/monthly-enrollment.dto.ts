import { ApiProperty } from '@nestjs/swagger';

export class MonthlyEnrollmentDto {
  @ApiProperty({
    example: {
      '1': 10,
      '2': 1,
      '3': 5,
    },
  })
  data: { [key: string]: number };

  constructor(partial: Partial<MonthlyEnrollmentDto> = {}) {
    Object.assign(this, partial);
  }
}
