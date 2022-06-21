import { UserProperties } from '@user/Domain';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import FullNameModel from './FullName.model';

interface UserPropsToOrmModel extends Omit<UserProperties, 'fullName'> {
  fullNameFk: FullNameModel;
}

@Entity('users')
export default class UserModel implements UserPropsToOrmModel {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    name: 'user_id',
  })
  public userId!: string;

  @Column({ nullable: false, unique: true, length: 100 })
  public email!: string;

  @OneToOne(() => FullNameModel)
  @JoinColumn()
  public fullNameFk!: FullNameModel;

  @Column({ nullable: false, length: 100 })
  public hash!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
