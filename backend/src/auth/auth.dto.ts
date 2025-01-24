import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must be a string.' })
  @Length(4, 50, { message: 'Name length must be at least 4 letters.' })
  name: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  @Length(1, 50, { message: 'Email must be between 1 and 50 characters.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @Length(8, 50, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required.' })
  @IsString({ message: 'Confirm password must be a string.' })
  @Length(8, 50, { message: 'Confirm password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  confirmPassword: string;

}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsInt()
  otp: number;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm Password is required.' })
  confirmPassword: string;
}
