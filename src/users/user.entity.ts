import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio?: string;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  async validatePassword(candidatePassword: string): Promise<boolean> {
    return await compare(candidatePassword, this.password);
  }
}
