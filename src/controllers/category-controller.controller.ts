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
import {Category, User} from '../models';
import {CategoryRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings,securityId, UserProfile} from '@loopback/security';
//import { TokenServiceBindings as DefaultTokenServiceBindings } from '@loopback/authentication-jwt';

@authenticate('jwt')
export class CategoryController {
  constructor(
    //@inject('authentication.currentUser') private currentUser: UserProfile,
    @inject(SecurityBindings.USER) private currentUser: UserProfile,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  // Protect this route with JWT authentication
  @authenticate('jwt')
  @post('/categories')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['categoryId', 'userId'], // userId is set programmatically
          }),
        },
      },
    })
    category: Omit<Category, 'categoryId' | 'userId'>,
  ): Promise<Category> {
    console.log('Injected Current User:',this.currentUser);
    // Add the logged-in user's ID to the category
    const userId = this.currentUser[securityId];

    console.log('Current User:',this.currentUser);

    

    if (!userId) {
      throw new HttpErrors.Unauthorized('User not authenticated');
    }
    category.userId = userId;
    return this.categoryRepository.create(category);
    

  }

  // Protect this route with JWT authentication
  //@authenticate('jwt')
  @get('/categories')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    const userId = this.currentUser[securityId];
    return this.categoryRepository.find({
      where: {userId}, // Fetch categories belonging to the logged-in user
      ...filter,
    });
  }

  //@authenticate('jwt')
  @patch('/categories')
  @response(200, {
    description: 'Category PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Partial<Category>,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    const userId = this.currentUser[securityId];
    return this.categoryRepository.updateAll(category, {userId, ...where});
  }

  //@authenticate('jwt')
  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async findById(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('id') id: string,
  ): Promise<Category> {
    const userId = this.currentUser[securityId];
    const category = await this.categoryRepository.findOne({
      where: {id, userId},
    });
    if (!category) {
      throw new HttpErrors.NotFound('Category not found or not authorized');
    }
    return category;
  }

  //@authenticate('jwt')
  @patch('/categories/{id}')
  @response(204, {
    description: 'Category PATCH success',
  })
  async updateById(
    //@inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Partial<Category>,
  ): Promise<void> {
    const userId = this.currentUser[securityId];
    const existingCategory = await this.categoryRepository.findOne({
      where: {id, userId},
    });
    if (!existingCategory) {
      throw new HttpErrors.NotFound('Category not found or not authorized');
    }
    await this.categoryRepository.updateById(id, category);
  }

  //@authenticate('jwt')
  @del('/categories/{id}')
  @response(204, {
    description: 'Category DELETE success',
  })
  async deleteById(
   // @inject('authentication.currentUser') currentUser: UserProfile,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const userId = this.currentUser[securityId];
    const existingCategory = await this.categoryRepository.findOne({
      where: {id, userId},
    });
    if (!existingCategory) {
      throw new HttpErrors.NotFound('Category not found or not authorized');
    }
    await this.categoryRepository.deleteById(id);
  }
}
