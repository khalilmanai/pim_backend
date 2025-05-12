import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user-schemas/user.schema';
import { RegisterDto } from 'src/user/user-dto/register.dto';
import { LoginDto } from 'src/user/user-dto/login.dto';
import { ThirdPartyAuthService } from './third-party-auth/third-party.auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly thirdPartyAuthService: ThirdPartyAuthService,
  ) {}

  /**
   * Register a new user.
   */
  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, username, password, cin } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new this.userModel({
      email,
      username,
      password: hashedPassword,
      cin,
    });
    await user.save();

    // Generate JWT token
    const payload = { userId: user._id };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  /**
   * Log in a user.
   */
  async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
    const { email, password } = loginDto;

    // Check if user exists
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user._id });
    return { token, user };
  }

  /**
   * Log out a user by clearing their JWT token.
   */
  async logout(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.token = null; // Clear token field if you track tokens in the database
      await user.save();
    }
  }

  /**
   * Handle third-party sign-in (Google, Facebook, Apple).
   */
  async thirdPartySignIn(
    provider: 'google' | 'facebook' | 'apple',
    profile: { email: string; username: string },
  ) {
    let user = await this.userModel.findOne({ email: profile.email });

    if (!user) {
      user = new this.userModel({
        email: profile.email,
        username: profile.username,
        provider,
      });
      await user.save();
    }

    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }
}
