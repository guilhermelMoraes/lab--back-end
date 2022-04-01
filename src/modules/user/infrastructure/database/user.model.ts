import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'uuid', nullable: false, unique: true })
  public user_id!: string;

  @Column({ nullable: false, unique: true, length: 100 })
  public email!: string;

  @Column({ nullable: false, length: 100 })
  public username!: string;

  @Column({ nullable: false, length: 100 })
  public hash!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
