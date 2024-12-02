import {BindingScope, injectable, inject} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {HttpErrors} from '@loopback/rest';
//import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {TokenServiceBindings as CustomTokenServiceBindings} from '../key';
import {TokenService} from '@loopback/authentication';
import {securityId} from '@loopback/security';
import {UserProfile} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService implements TokenService {
  constructor(
    @inject(CustomTokenServiceBindings.TOKEN_SECRET) private jwtSecret: string,
    @inject(CustomTokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,

    
  ) {}

  /**
   * Generate a JWT token with user profile
   */
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile || !userProfile[securityId]) {
      throw new HttpErrors.Unauthorized('Invalid user profile to generate token');
    }

    const payload = {
      securityId: userProfile[securityId],
      email: userProfile.email,
      id: userProfile.id.toString(),
    };

    console.log('Payload for token:', payload);

    return jwt.sign(payload, this.jwtSecret, {expiresIn: this.jwtExpiresIn});
  }

  /**
   * Verify the validity of a given token
   */
  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
      console.log('Decoded token:', decodedToken);

      if (!decodedToken || !decodedToken['securityId']) {
        throw new HttpErrors.Unauthorized('Invalid token payload');
      }

      const userProfile: UserProfile = {
  
        [securityId]: decodedToken['securityId'],
        //[securityId]: decodedToken.id as string,
        email: decodedToken.email as string,
        id: decodedToken.id as string,
      };

      return userProfile;
    } catch (error)
    { console.error('Error verifying token:', error);
      throw new HttpErrors.Unauthorized(`Error verifying token: ${error.message}`);
    }
  }

  /**
   * Decode a token without verification
   */
  async decodeToken(token: string): Promise<object|null> {
  return jwt.decode(token) as object;
  }
  
}
