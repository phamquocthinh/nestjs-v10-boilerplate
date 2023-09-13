import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import { UserRoleEnum } from 'src/shared/enums/roles';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.BROKER,
  })
  role: UserRoleEnum;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
