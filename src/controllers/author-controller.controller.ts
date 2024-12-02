import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Author} from '../models';
import {AuthorRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings,securityId, UserProfile} from '@loopback/security';
//import {TokenServiceBindings} from '../key';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import { JWTService } from '../services/jwt-services';

@authenticate('jwt')
export class AuthorController {
  constructor(
    @repository(AuthorRepository)
    public authorRepository: AuthorRepository,
    @inject(SecurityBindings.USER) private currentUser: UserProfile,
    //@inject('authentication.currentUser') private currentUser: UserProfile,
  ) {}

  // Protect this route with JWT authentication
  
  @post('/authors')
  @response(200, {
    description: 'Author model instance',
    content: {'application/json': {schema: getModelSchemaRef(Author)}},
  })
  async create(
    
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {
            title: 'NewAuthor',
            exclude: ['authId', 'userId'], // userId is set programmatically
          }),
        },
      },
    })
    author: Omit<Author, 'authId' | 'userId'>,
    //@inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<Author> {
    // Add the logged-in user's ID to the author
    const userId = this.currentUser[securityId]?.toString();
    
    if (!userId) {
      throw new HttpErrors.Unauthorized('User not authenticated');
    }
    author.userId = userId;
    return this.authorRepository.create({
      ...author,
      userId,
    });
  }

  //@authenticate('jwt')
  @get('/authors')
  @response(200, {
    description: 'Array of Author model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Author, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.filter(Author) filter?: Filter<Author>,
  ): Promise<Author[]> {
    const userId = this.currentUser[securityId]?.toString();
    return this.authorRepository.find({
      where: {userId}, // Fetch authors belonging to the logged-in user
      ...filter,
    });
  }
  


  //@authenticate('jwt')
  @patch('/authors')
  @response(200, {
    description: 'Author PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {partial: true}),
        },
      },
    })
    author: Partial<Author>,
    @param.where(Author) where?: Where<Author>,
  ): Promise<Count> {
    const userId = this.currentUser[securityId]?.toString();
    return this.authorRepository.updateAll(author, {userId, ...where});
  }

  //@authenticate('jwt')
  @get('/authors/{id}')
  @response(200, {
    description: 'Author model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Author, {includeRelations: true}),
      },
    },
  })
  async findById(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('id') id: string,
    @param.filter(Author, {exclude: 'where'}) filter?: FilterExcludingWhere<Author>,
  ): Promise<Author> {
    const userId = this.currentUser[securityId]?.toString();
    const author = await this.authorRepository.findOne({
      where: {id, userId},
    });
    if (!author) {
      throw new HttpErrors.NotFound('Author not found or not authorized');
    }
    return author;
  }

  //@authenticate('jwt')
  @patch('/authors/{id}')
  @response(204, {
    description: 'Author PATCH success',
  })
  async updateById(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Author, {partial: true}),
        },
      },
    })
    author: Partial<Author>,
  ): Promise<void> {
    const userId = this.currentUser[securityId]?.toString();
    const existingAuthor = await this.authorRepository.findOne({
      where: {id, userId},
    });
    if (!existingAuthor) {
      throw new HttpErrors.NotFound('Author not found or not authorized');
    }
    await this.authorRepository.updateById(id, author);
  }

  //@authenticate('jwt')

  @del('/authors/{id}')
  @response(204, {
    description: 'Author DELETE success',
  })
  async deleteById(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const userId = this.currentUser[securityId]?.toString();
    const existingAuthor = await this.authorRepository.findOne({
      where: {id, userId},
    });
    if (!existingAuthor) {
      throw new HttpErrors.NotFound('Author not found or not authorized');
    }
    await this.authorRepository.deleteById(id);
  }
}
