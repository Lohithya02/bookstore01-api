import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, requestBody, HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {compare, hash} from 'bcryptjs';
import {TokenServiceBindings as CustomTokenServiceBindings} from '../key';
import {User} from '../models';
import {Credentials} from '../repositories/user.repository';
import {UserProfile, securityId} from '@loopback/security';
import {JWTService} from '../services/jwt-services'; // Use correct relative path

//import {JWTService} from './services/jwt-services';
//import {JWTService} from '@services/jwt-services';

import { UserService } from '@loopback/authentication';

export class UserController {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(CustomTokenServiceBindings.TOKEN_SERVICE)
    private jwtService: JWTService,
    //@inject(UserServiceBindings.USER_SERVICE)
    //private userService: UserService<User, Credentials>,
  ) {}

  // Register a new user
  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User registration success',
        content: {'application/json': {schema: {'x-ts-type': User}}}, 
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: {'x-ts-type': User},
        },
      },
    })
    newUser: User,
  ): Promise<User> {
    newUser.password = await hash(newUser.password, 10);
    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }

  // Login user and issue a JWT token
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {type: 'object', properties: {token: {type: 'string'}}},
          },
        },
      },
    },
  })
  //@post('/users/login')
async loginUser(@requestBody() credentials: {email: string, password: string}): Promise<{token: string}> {
  const user = await this.userRepository.findOne({where: {email: credentials.email}});
  if (!user) {
    throw new HttpErrors.Unauthorized('User not found');
  }

  const isPasswordValid = await compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new HttpErrors.Unauthorized('Invalid credentials');
  }
  if (!user.id) {
    throw new HttpErrors.Unauthorized('User ID is missing');
  }

  
    const userProfile: UserProfile = {
    [securityId]: user.id.toString(),
    email: user.email,
    id: user.id.toString(),
  };

  const token = await this.jwtService.generateToken(userProfile);

  return {token};
}


  // Protected endpoint - requires JWT authentication
  @get('/users/me', {
    responses: {
      '200': {
        description: 'Current user profile',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                email: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async getCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<UserProfile> {
    return {
      [securityId]: currentUser[securityId], // Ensure this is correct
      name: currentUser.name,
      email: currentUser.email,
    };
  }
}
