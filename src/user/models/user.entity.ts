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

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  headline?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio?: string;

  toDto() {
    return new UserDto({
      id: this.id,
      fullName: this.fullName,
      username: this.username,
      role: this.role,
      email: this.email,
      phone: this.phone,
      headline: this.headline,
      image: this.image,
      bio: this.bio,
      audit: this.toAudit(),
    });
  }
}
