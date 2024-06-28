import { ApiOkResponsePaginated, Roles } from '@/common/decorators';
import { AuditActionDto, AuditActionQueryDto, UserRole } from '@/core/models';
import { AUDIT_ACTION_SERVICE, AuditActionService } from '@/core/services';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Setting')
@Controller('/admin/audit-actions')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class AuditActionController {
  constructor(
    @Inject(AUDIT_ACTION_SERVICE)
    private auditActionService: AuditActionService,
  ) {}

  @ApiOkResponsePaginated(AuditActionDto)
  @Get()
  async find(@Query() query: AuditActionQueryDto) {
    return await this.auditActionService.find(query);
  }
}
