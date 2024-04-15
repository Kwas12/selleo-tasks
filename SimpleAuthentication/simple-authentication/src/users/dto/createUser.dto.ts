import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsNumber()
  @IsOptional()
  shirtSize?: number;

  @IsString()
  @IsOptional()
  preferredTechnology?: string;
}
