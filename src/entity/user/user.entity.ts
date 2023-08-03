import { IsString, IsNotEmpty, Matches, IsInt } from 'class-validator';

// 封裝 response 的物件資訊
export class UserEntity {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\S@\S$/)
  email: string;

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
