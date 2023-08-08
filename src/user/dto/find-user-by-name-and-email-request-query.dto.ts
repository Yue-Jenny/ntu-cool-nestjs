import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';

// 審核 request 的物件資訊
export class findUserByNameOrEmailRequestQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\S@\S$/)
  email: string;
}
