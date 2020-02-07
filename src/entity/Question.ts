import { Base } from './BaseEntity';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Tuple } from '../types';
import { Category } from './Category';

@Entity()
export class Question<T extends number = number> extends Base {
  length: T;
  constructor(l: T) {
    super();
    this.length = l;
  }
  @Column({type: 'text'})
  content: string;
  
  @Column('simple-array')
  selects: Tuple<string, T>;
  
  @Column()
  correct: number;

  @ManyToMany(() => Category, category => category.questions)
  @JoinTable()
  categories: Category[];
}
