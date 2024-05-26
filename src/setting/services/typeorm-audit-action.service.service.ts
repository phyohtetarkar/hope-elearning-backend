import { AuditActionEntity } from '@/core/entities/audit-action.entity';
import { UserEntity } from '@/core/entities/user.entity';
import { AuditEvent } from '@/core/events';
import {
  AuditActionDto,
  AuditActionQueryDto,
  PageDto,
  QueryDto,
} from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { AuditActionService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormAuditActionServiceService implements AuditActionService {
  constructor(
    private security: SecurityContextService,
    private dataSource: DataSource,
    @InjectRepository(AuditActionEntity)
    private auditActionRepo: Repository<AuditActionEntity>,
  ) {}

  @OnEvent('audit.created')
  async create(values: AuditEvent): Promise<void> {
    const user = this.security.getAuthenticatedUserOpt();
    await this.auditActionRepo.insert({
      resourceId: values.resourceId,
      resourceType: values.resourceType,
      actorId: user ? user.id : '0',
      actorType: user ? 'user' : 'system',
      event: 'created',
      context: values.context,
      createdAt: new Date(),
    });
  }

  @OnEvent('audit.updated')
  async update(values: AuditEvent): Promise<void> {
    const user = this.security.getAuthenticatedUserOpt();
    await this.auditActionRepo.insert({
      resourceId: values.resourceId,
      resourceType: values.resourceType,
      actorId: user ? user.id : '0',
      actorType: user ? 'user' : 'system',
      event: 'updated',
      context: values.context,
      createdAt: new Date(),
    });
  }

  @OnEvent('audit.deleted')
  async delete(values: AuditEvent): Promise<void> {
    const user = this.security.getAuthenticatedUserOpt();
    await this.auditActionRepo.insert({
      resourceId: values.resourceId,
      resourceType: values.resourceType,
      actorId: user ? user.id : '0',
      actorType: user ? 'user' : 'system',
      event: 'deleted',
      context: values.context,
      createdAt: new Date(),
    });
  }

  async find(query: AuditActionQueryDto): Promise<PageDto<AuditActionDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const auditQuery = this.auditActionRepo.createQueryBuilder('audit');

    auditQuery
      .select([])
      .addSelect("DATE_TRUNC('day', audit.createdAt)", 'created_date')
      .addSelect('COUNT(audit.id)', 'audit_count')
      // .addSelect('MAX(audit.id)', 'audit_id')
      .addSelect('MAX(audit.createdAt)', 'created_at')
      .addSelect('audit.resourceId', 'resource_id')
      .addSelect('audit.resourceType', 'resource_type')
      .addSelect('audit.event', 'event')
      .addSelect('audit.actorId', 'actor_id')
      .addSelect('audit.actorType', 'actor_type')
      .addSelect((qb) => {
        return qb
          .select('user.nickname')
          .from(UserEntity, 'user')
          .where("audit.actorId = user.id AND audit.actorType = 'user'");
      }, 'actor_name')
      .addSelect((qb) => {
        return qb
          .select('user.image')
          .from(UserEntity, 'user')
          .where("audit.actorId = user.id AND audit.actorType = 'user'");
      }, 'actor_image')
      .addSelect((qb) => {
        return qb
          .select('aa.context')
          .from(AuditActionEntity, 'aa')
          .where('MAX(audit.id) = aa.id');
      }, 'audit_context');

    if (query.event) {
      auditQuery.andWhere('audit.event = :event', { event: query.event });
    }

    if (query.resource) {
      auditQuery.andWhere('audit.resourceType = :resourceType', {
        resourceType: query.resource,
      });
    }

    auditQuery
      .groupBy('audit.resourceId')
      .addGroupBy('audit.resourceType')
      .addGroupBy('audit.actorId')
      .addGroupBy('audit.actorType')
      .addGroupBy('audit.event')
      .addGroupBy('created_date');

    const countResult = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('(' + auditQuery.getQuery() + ')', 'grouped_results')
      .setParameters(auditQuery.getParameters())
      .getRawOne();

    auditQuery.orderBy('created_at', 'DESC').offset(offset).limit(limit);
    const list = await auditQuery.getRawMany();
    const count = Number(countResult['count']);

    return PageDto.from({
      list: list.map((raw) => {
        return new AuditActionDto({
          resourceId: raw['resource_id'],
          resourceType: raw['resource_type'],
          actorId: raw['actor_id'],
          actorType: raw['actor_type'],
          actorName: raw['actor_name'] ?? 'System',
          actorImage: raw['actor_image'],
          event: raw['event'],
          context: raw['audit_context'],
          count: Number(raw['audit_count']),
          createdAt: raw['created_at'],
        });
      }),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
