import { FullNameProperties } from '@user/Domain';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('full_name')
export default class FullNameModel implements FullNameProperties {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'first_name', length: 45 })
  public firstName!: string;

  @Column({ length: 45 })
  public surname!: string;
}
