export class UserMetaDto {
  enrollmentCount: number;
  bookmarkCount: number;

  constructor(partial: Partial<UserMetaDto> = {}) {
    Object.assign(this, partial);
  }
}
