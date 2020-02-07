import { Base } from './BaseEntity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends Base {
  @Column({unique: true})
  name: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  email: string;
  
  @Column({nullable: false, default: false})
  verified: boolean;

  @Column({unique: true, nullable: false})
  verifyCode: string;
  
  @Column({type: 'varchar', length: 100, default: ''})
  introduction: string;
}