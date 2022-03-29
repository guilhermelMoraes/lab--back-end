import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false, unique: true })
  public email!: string;

  @Column({ nullable: false })
  public username!: string;

  @Column({ nullable: false })
  public hash!: string;
}
