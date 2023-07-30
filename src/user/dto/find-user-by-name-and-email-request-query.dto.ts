import { IsString, IsNotEmpty, Matches } from 'class-validator';

// 審核 request 的物件資訊
export class findUserByNameAndEmailRequestQueryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\S@\S$/)
  email: string;
}
