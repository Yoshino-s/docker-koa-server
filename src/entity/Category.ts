import { Base } from './BaseEntity';
import { Entity, Column, ManyToMany } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Category extends Base {
  @Column()
  name: string;

  @Column({type: 'text'})
  description: string;

  @ManyToMany(() => Question, question => question.categories)
  questions: Question[];
}
