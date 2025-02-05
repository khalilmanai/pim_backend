import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { RegisterDto } from './user-dto/register.dto';

import { User } from './user-schemas/user.schema';
import { UpdateUserDto } from './user-dto/user-update.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user.
   * @param registerDto - The data transfer object for user registration.
   * @returns The newly created user document.
   */
  @Post()
  async CreateUser(@Body() registerDto: RegisterDto): Promise<User> {
    try {
      return await this.userService.create(registerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Retrieves a user by ID.
   * @param userId - The ID of the user to retrieve.
   * @returns The user document if found.
   */
  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    try {
      return await this.userService.findById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Updates user details partially.
   * @param userId - The ID of the user to update.
   * @param updateData - The fields to update.
   * @returns The updated user document.
   */
  @Patch(':id')
  async updateUserProfile(
    @Param('id') userId: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.updateProfile(userId, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }


}
