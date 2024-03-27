import { AuditingEntity } from '@/common/models/auditing.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserDto } from './user.dto';
import { UserRole } from './user-role.enum';

@Entity({ name: 'user' })
export class UserEntity extends AuditingEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  headline?: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio?: string | null;

  toDto() {
    return new UserDto({
      id: this.id,
      fullName: this.fullName,
      username: this.username,
      role: this.role,
      email: this.email ?? undefined,
      phone: this.phone ?? undefined,
      headline: this.headline ?? undefined,
      image: this.image ?? undefined,
      bio: this.bio ?? undefined,
      audit: this.toAudit(),
    });
  }
}
