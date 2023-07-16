import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  firstname: string;

  @Column({ nullable: false, type: 'text' })
  lastname: string;

  @Column({ nullable: false, type: 'text' })
  email: string;

  @Column({ nullable: false, type: 'text' })
  password: string;

  @Column({ nullable: true })
  dateCreated: Date;

  @Column({ nullable: true })
  dateUpdated: Date;
}