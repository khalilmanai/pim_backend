import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user-schemas/user.schema';
import { RegisterDto } from './user-dto/register.dto';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // For generating reset token
import * as bcrypt from 'bcrypt';

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
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = new this.userModel({ ...registerDto, password: hashedPassword });
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('Failed to create user: ' + error.message);
    }
  }

  /**
   * Finds a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns The user document if found.
   */
  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    return user;
  }

  /**
   * Finds a user by their email.
   * @param email - The email of the user to retrieve.
   * @returns The user document if found.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }
    return user;
  }

  /**
   * Updates user details partially.
   * @param userId - The ID of the user to update.
   * @param updateData - An object containing the fields to update.
   * @returns The updated user document.
   */
  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    return updatedUser;
  }

  /**
   * Deletes a user by ID.
   * @param userId - The ID of the user to delete.
   * @returns A success message.
   */
  async deleteUser(userId: string): Promise<string> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    return 'User deleted successfully';
  }

  /**
   * Logs out a user by clearing their token.
   * @param userId - The ID of the user to log out.
   */
  async logout(userId: string): Promise<void> {
    const user = await this.findById(userId);
    user.token = null;
    await user.save();
  }

  /**
   * Generates a reset token for password reset.
   * @param email - The user's email to generate the reset token for.
   * @returns The generated reset token.
   */
  async generateResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    const resetToken = uuidv4();
    user.resetToken = resetToken;
    await user.save();
    return resetToken;
  }

  /**
   * Verifies if the reset token is valid.
   * @param resetToken - The reset token to verify.
   * @returns The user associated with the reset token.
   */
  async verifyResetToken(resetToken: string): Promise<User> {
    const user = await this.userModel.findOne({ resetToken }).exec();
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token.');
    }
    return user;
  }

  /**
   * Resets the user's password after token verification.
   * @param resetToken - The reset token to verify.
   * @param newPassword - The new password for the user.
   * @returns A success message.
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<string> {
    const user = await this.verifyResetToken(resetToken);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();
    return 'Password updated successfully';
  }

  /**
   * Updates a user's password.
   * @param userId - The ID of the user.
   * @param oldPassword - The old password.
   * @param newPassword - The new password.
   * @returns A success message.
   */
  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<string> {
    const user = await this.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password.');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return 'Password updated successfully';
  }
}
