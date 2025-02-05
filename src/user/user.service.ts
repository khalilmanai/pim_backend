import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user-schemas/user.schema';

import { RegisterDto } from './user-dto/register.dto';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Creates a new user.
   * @param registerDto - The data transfer object for user registration.
   * @returns The newly created user document.
   */
  async create(registerDto: RegisterDto): Promise<User> {
    try {
      // Validate or transform data if necessary before creation
      const newUser = new this.userModel(registerDto);
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Failed to create user: ' + error.message);
    }
  }

  /**
   * Finds a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns The user document if found.
   * @throws NotFoundException if the user does not exist.
   */
  async findById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to retrieve user: ' + error.message,
      );
    }
  }

  /**
   * Updates user details partially.
   * @param userId - The ID of the user to update.
   * @param updateData - An object containing the fields to update.
   * @returns The updated user document.
   * @throws NotFoundException if the user does not exist.
   */
  async updateProfile(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(
        'Failed to update user profile: ' + error.message,
      );
    }
  }

  async logout(userId: string) {
    const user = await this.findById(userId);
    if (user) {
      user.token = null;
    }
  }
}
