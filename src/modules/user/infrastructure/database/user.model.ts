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

  @Column({
    type: 'uuid', nullable: false, unique: true, name: 'user_id',
  })
  public userId!: string;

  @Column({ nullable: false, unique: true, length: 100 })
  public email!: string;

  @Column({ nullable: false, length: 100 })
  public username!: string;

  @Column({ nullable: false, length: 100 })
  public hash!: string;

  @Column({ nullable: false, default: false })
  public isEmailVerified!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
