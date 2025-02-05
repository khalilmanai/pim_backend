import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

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

  @IsString()
  image?: string; // This should store the file path or name

  token?: string; // Optional field, generated internally after registration
}
