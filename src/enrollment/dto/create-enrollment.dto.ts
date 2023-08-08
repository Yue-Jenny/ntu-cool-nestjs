import { Transform } from 'class-transformer';
import { IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { Roles } from '../roles.enum';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10)) // 使用 parseInt 將 string 轉換為 number
  courseId: number;

  @IsEnum(Roles, {
    message: 'Role must be either "student" or "teacher"',
    each: true,
  })
  @Transform(({ value }) => value.toLowerCase())
  role: Roles;
}
