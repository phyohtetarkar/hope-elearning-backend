import { IsInt, IsNotEmpty } from 'class-validator';

export class SkillUpdateDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;
}
