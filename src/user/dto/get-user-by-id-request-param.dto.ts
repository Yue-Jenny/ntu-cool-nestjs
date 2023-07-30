import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

// 審核 request 的物件資訊
export class GetUserByIdRequestParamDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  @IsNumber()
  id: number;
}
