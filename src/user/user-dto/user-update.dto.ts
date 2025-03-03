import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'JohnDoe123',
    description: 'New username',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'New email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiProperty({
    example: 'NewStrongPass@123',
    description: 'New password',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiProperty({
    example: 'profile-image-updated.jpg',
    description: 'Updated profile image file path',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
