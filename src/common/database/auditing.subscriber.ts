import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditingEntity } from '../models/auditing.entity';
import { AsyncLocalStorage } from 'async_hooks';
import { AuthUserStore } from '@/common/als/auth-user.store';

@EventSubscriber()
export class AuditingSubscriber
  implements EntitySubscriberInterface<AuditingEntity>
{
  constructor(
    dataSource: DataSource,
    private als: AsyncLocalStorage<AuthUserStore>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AuditingEntity;
  }

  beforeInsert(event: InsertEvent<AuditingEntity>) {
    const userId = this.als.getStore()?.userId;
    console.log('beforeInsert', event.entity);
    if (userId) {
      event.entity.createdBy = userId;
      // event.entity.updatedBy = user.id;
    }
    // const date = new Date();
    // event.entity.createdAt = date;
    // event.entity.updatedAt = date;
  }

  beforeUpdate(event: UpdateEvent<AuditingEntity>) {
    const userId = this.als.getStore()?.userId;
    console.log('afterUpdate', event.entity);
    if (!event.entity) {
      return;
    }
    if (userId) {
      event.entity.updatedBy = userId;
    }
    // const date = new Date();
    // event.entity.updatedAt = date;
  }

  beforeSoftRemove(event: SoftRemoveEvent<AuditingEntity>) {
    const userId = this.als.getStore()?.userId;
    console.log('beforeSoftRemove', event.entity);
    if (!event.entity) {
      return;
    }
    if (userId) {
      event.entity.deletedBy = userId;
    }
  }
}
