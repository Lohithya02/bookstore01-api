import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User, UserRelations} from '../models';


export interface Credentials {
  email: string;
  Username:string;
  password: string;
  id:string;

}


export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(User, dataSource);
  }

  async findCredentials(userId: typeof User.prototype.id): Promise<Credentials | null> {
    // Customize this logic based on your data model
    /*return this.findOne({
      where: {id: userId},
      fields:{email:true,password:true}, // Adjust if your field is different
    });*/
    const user = await this.findById(userId);
    if (user) {
      return {
        email: user.email,
        password: user.password,
        Username:user.username,
        id:user.id.toString(),
      };
    }
    return null;
  }
}
