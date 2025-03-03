import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'JohnDoe123', description: 'Unique username' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @ApiProperty({
    example: 'StrongPass@123',
    description:
      'Password must contain an uppercase letter, lowercase letter, number, and special character',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must include at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must include at least one lowercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must include at least one number' })
  @Matches(/[\W_]/, {
    message: 'Password must include at least one special character',
  })
  password: string;

  @ApiProperty({
    example: 'profile-image.jpg',
    description: 'Profile image file path',
    required: false,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    example: '12345678',
    description: 'National Identity Card number',
  })
  @IsString()
  @IsNotEmpty({ message: 'CIN is required' })
  cin: string;
}
