import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Roles } from '../roles.enum';

export class GetEnrollmentsByCourseQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  userId: number;

  @IsOptional()
  @IsEnum(Roles, {
    message: 'Role must be either "student" or "teacher"',
    each: true,
  })
  @Transform(({ value }) => value.toLowerCase())
  role: Roles;
}
