import {Entity, model, property, hasMany} from '@loopback/repository';
import {Book} from './book.model';

@model({settings: {strict: false}})
export class Category extends Entity {
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
  categoryName: string;

  @property({
    type: 'string',
    required: true,
  })
  CategoryDescription: string;

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

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
