import { Injectable, BadRequestException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class ThirdPartyAuthService {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Verify Google Token
   */
  async verifyGoogleToken(token: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      return {
        email: payload.email,
        username: payload.name || payload.email.split('@')[0],
      };
    } catch (error) {
      throw new BadRequestException(`Failed to verify Google token: ${error.message}`);
    }
  }

  /**
   * Verify Facebook Token
   */
  async verifyFacebookToken(token: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`,
      );

      const { email, name } = response.data;
      if (!email) {
        throw new BadRequestException('Invalid Facebook token or email not provided');
      }

      return {
        email,
        username: name || email.split('@')[0],
      };
    } catch (error) {
      throw new BadRequestException(`Failed to verify Facebook token: ${error.message}`);
    }
  }

  /**
   * Verify Apple Token
   */
  async verifyAppleToken(token: string): Promise<any> {
    try {
      const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
      });

      const getKey = (header: any, callback: Function) => {
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            return callback(err, null);
          }
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        });
      };

      const decodedToken = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });

      const email = decodedToken['email'];
      const username = decodedToken['name'] || email.split('@')[0];

      return { email, username };
    } catch (error) {
      throw new BadRequestException(`Failed to verify Apple token: ${error.message}`);
    }
  }
}
