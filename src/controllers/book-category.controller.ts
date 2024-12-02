import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Book,
  Category,
} from '../models';
import {BookRepository} from '../repositories';

export class BookCategoryController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
  ) { }

  @get('/books/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Book',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category),
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.string('id') id: typeof Book.prototype.title,
  ): Promise<Category> {
    return this.bookRepository.category(id);
  }
}
