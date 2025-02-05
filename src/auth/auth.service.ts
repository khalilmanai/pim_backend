import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user-schemas/user.schema';
import { RegisterDto } from 'src/user/user-dto/register.dto';
import { LoginDto } from 'src/user/user-dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user.
   */
  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, username, password } = registerDto;

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
  async login(loginDto: LoginDto): Promise<{ token: string }> {
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
    return { token };
  }

  /**
   * Log out a user by clearing their JWT token.
   */
  async logout(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.token = null; // Clear token field if you track tokens in the database
      await user.save();
    }
  }

  /**
   * Handle third-party sign-in.
   */
  async thirdPartySignIn(
    provider: string,
    profile: any,
  ): Promise<{ token: string }> {
    const { email, username } = profile;

    // Check if user already exists
    let user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      // Register new user if not found
      user = new this.userModel({
        email,
        username: username || email.split('@')[0],
        thirdPartyProvider: provider,
      });
      await user.save();
    }

    // Generate JWT token
    const token = this.jwtService.sign({ userId: user._id });
    return { token };
  }
}
