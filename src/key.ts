import {BindingKey} from '@loopback/core';
import {TokenService, UserService} from '@loopback/authentication';
import {User} from './models';
import {Credentials} from './repositories';

export namespace TokenServiceBindings {
  // Binding for the Token Service
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.jwt.service');

  // Binding for the JWT secret key
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');

  // Binding for the JWT expiration time
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expiresIn');

  
}

export namespace UserServiceBindings {
  // Binding for the User Service
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service');
}

export namespace TokenServiceConstants {
  // Default JWT secret key (update this with your actual secret)
  export const TOKEN_SECRET_VALUE = 'Fetho2024';

  // Default JWT expiration time (e.g., 1 hour)
  export const TOKEN_EXPIRES_IN_VALUE = '24h';

}

