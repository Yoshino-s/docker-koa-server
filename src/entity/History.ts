import { Base } from './BaseEntity';
import { Entity, Column, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Question } from './Question';
import { User } from './User';

export enum HistoryStatus {
  CORRECT = 'correct',
  WRONG = 'wrong',
  UNQUALIFIED = 'unqualified',
  UNKNOWN = 'unknown',
}

@Entity()
export class Category extends Base {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Question)
  @JoinColumn()
  question: Question;

  @Column()
  answer: number;

  @Column({
    type: 'enum',
    enum: HistoryStatus,
    default: HistoryStatus.UNKNOWN
  })
  status: HistoryStatus;
}
