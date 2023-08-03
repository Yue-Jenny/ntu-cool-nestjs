import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetEnrollmentsByUserParamDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  userId: number;
}
