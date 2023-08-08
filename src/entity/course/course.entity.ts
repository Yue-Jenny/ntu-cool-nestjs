import { IsString, IsInt } from 'class-validator';

// 封裝 response 的物件資訊
export class CourseEntity {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  constructor(user: CourseEntity) {
    Object.assign(this, user);
  }
}
