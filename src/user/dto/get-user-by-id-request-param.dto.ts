import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

// 審核 request 的物件資訊
export class GetUserByIdRequestParamDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  @IsInt()
  id: number;
}
