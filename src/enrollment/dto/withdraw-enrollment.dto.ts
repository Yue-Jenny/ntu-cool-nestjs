import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class WithDrawUserDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  enrollmentId: number;
}
