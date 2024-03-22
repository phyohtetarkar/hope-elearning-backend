import { AuditingEntity } from '@/common/models/auditing.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Role, UserDto } from './user.dto';

@Entity()
export class User extends AuditingEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

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

  toDto(): UserDto {
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
