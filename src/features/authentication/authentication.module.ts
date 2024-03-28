import { SecurityModule } from '@/security';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [SecurityModule],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
