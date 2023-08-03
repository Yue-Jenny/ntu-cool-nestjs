import { IsString, IsInt } from 'class-validator';

// 封裝 response 的物件資訊
export class EnrollmentEntity {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;

  @IsString()
  role: string;

  constructor(user: EnrollmentEntity) {
    Object.assign(this, user);
  }
}
