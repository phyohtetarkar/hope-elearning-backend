export class UserCreateDto {
  id: string;
  nickname: string;
  email?: string;
  image?: string;
  emailVerified?: boolean;
}
