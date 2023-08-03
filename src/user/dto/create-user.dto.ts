import { IsString, IsNotEmpty, Matches } from 'class-validator';

// 審核 request 的物件資訊
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\S@\S$/)
  email: string;
}
