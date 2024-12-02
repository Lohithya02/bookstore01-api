import {Entity, model, property, hasMany} from '@loopback/repository';
import {Book} from './book.model';

@model({settings: {strict: false}})
export class Author extends Entity {
  @property({
    type: 'string',
    id:true,
    generated:true,
    //required: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  Name: string;

  @property({
    type: 'string',
    required: true,
  })
  Bio: string;

  @property({
    type: 'string',
    required: true,
  })
  Email: string;

  @property({
    type: 'string',
    
  })
  userId: string;

  @hasMany(() => Book)
  books: Book[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  // describe navigational properties here
}

export type AuthorWithRelations = Author & AuthorRelations;
