import {JWTService} from './services/jwt-services';
import {TokenServiceBindings as CustomTokenServiceBindings} from './key';
//import { TokenServiceBindings } from '@loopback/authentication-jwt';
import {ApplicationConfig} from '@loopback/core';
import {BootMixin} from '@loopback/boot';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {RestBindings} from '@loopback/rest';
import {RestExplorerBindings} from '@loopback/rest-explorer'
import cors from 'cors';
import {MySequence} from './sequence';
import {registerAuthenticationStrategy} from '@loopback/authentication';
//import {JWTStrategy} from '@loopback/authentication-jwt';

//import {ApiExplorerService} from '@loopback/openapi-v3';
import * as path from 'path';
import {
  JWTAuthenticationComponent,
  MyUserService,
  TokenServiceConstants,
  TokenServiceBindings as DefaultTokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {AuthenticationComponent} from '@loopback/authentication';
//import {PasswordHasherBindings} from './key';
import {UserRepository} from './repositories';
//import {BcryptHasher} from './services/bcrypt-hasher';
export {ApplicationConfig}; 

export class Bookstore01ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  currentUser: any;
  jwtExpiresIn: any;
  jwtSecret: any;
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //registerAuthenticationStrategy(this, JWTStrategy);

    this.component(JWTAuthenticationComponent);
    

    // Bind custom TokenService (for login functionality)
    this.bind(CustomTokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(CustomTokenServiceBindings.TOKEN_SECRET).to('Fetho2024');
    this.bind(CustomTokenServiceBindings.TOKEN_EXPIRES_IN).to('24h');

    // Bind default TokenService (for `@authenticate('jwt')`)
    this.bind(DefaultTokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(DefaultTokenServiceBindings.TOKEN_SECRET).to('Fetho2024');
    this.bind(DefaultTokenServiceBindings.TOKEN_EXPIRES_IN).to('24h');

    console.log('JWT Secret:', this.getSync(CustomTokenServiceBindings.TOKEN_SECRET));
    console.log('Token Expiration:', this.getSync(CustomTokenServiceBindings.TOKEN_EXPIRES_IN));
    console.log(this.find('authentication.currentUser'));


    this.component(AuthenticationComponent);
    this.sequence(MySequence);


    
    //console.log(this.get(TokenServiceBindings.TOKEN_SERVICE));
    //console.log(this.get(TokenServiceBindings.TOKEN_SECRET));
    //console.log('Authenticated User:', this.currentUser);


    
    
    //this.component(AuthenticationComponent);


    this.expressMiddleware('cors',cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      //preflightContinue: false,
      //optionsSuccessStatus: 204,
      allowedHeaders:['Content-Type','Authorization'],
    }),
    {key:'CORS_MIDDLEWARE'});

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);


    this.configure(RestExplorerBindings.COMPONENT).to({
      path:'/explorer',
    })
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    this.static('/', path.join(__dirname, '../public')); // if you want a static page

    

    // Boot the application (registers all controllers)
    this.boot();

    

    //this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    //this.bind(PasswordHasherBindings.ROUNDS).to(10);

    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  explorer(arg0: string) {
    throw new Error('Method not implemented.');
  }
}