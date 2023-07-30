import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

// 封裝 response 的物件資訊
export class UserEntity {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\S@\S$/)
  email: string;

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
