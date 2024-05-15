import { UserDto, UserRole } from '@/core/models/user.dto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';

@Entity({ name: 'user' })
export class UserEntity extends AuditingEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 500 })
  nickname: string;

  @Column({ unique: true, length: 500 })
  username: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column()
  email: string;

  @Column({
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  headline?: string | null;

  @Column({
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  image?: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio?: string | null;

  @Column({ name: 'expired_at', type: 'timestamptz', nullable: true })
  expiredAt?: Date | null;

  toDto() {
    return new UserDto({
      id: this.id,
      nickname: this.nickname,
      username: this.username,
      role: this.role,
      email: this.email,
      headline: this.headline ?? undefined,
      image: this.image ?? undefined,
      bio: this.bio ?? undefined,
      expiredAt: this.expiredAt?.getTime() ?? 0,
      audit: this.toAudit(),
    });
  }
}
