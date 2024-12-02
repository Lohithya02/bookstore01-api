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
  Author,
} from '../models';
import {BookRepository} from '../repositories';

export class BookAuthorController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
  ) { }

  @get('/books/{id}/author', {
    responses: {
      '200': {
        description: 'Author belonging to Book',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Author),
          },
        },
      },
    },
  })
  async getAuthor(
    @param.path.string('id') id: typeof Book.prototype.title,
  ): Promise<Author> {
    return this.bookRepository.author(id);
  }
}
