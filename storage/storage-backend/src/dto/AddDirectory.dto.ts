import { IsNotEmpty, IsString } from 'class-validator';

export class AddDirectoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  directory: string;
}
