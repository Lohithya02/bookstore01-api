import {Entity, model, property, Model} from '@loopback/repository';
//import { ObjectId } from 'aws-sdk/clients/codecommit';

@model({settings: {strict: false}})
export class User extends Entity {
  //[x: string]: string;
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: String;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //[prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
