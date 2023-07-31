import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private users: UserEntity[] = [];
  private currentId = 1;

  createUser(createUserDto: CreateUserDto): UserEntity {
    const newUser = new UserEntity({
      id: this.currentId,
      name: createUserDto.name,
      email: createUserDto.email,
    });

    this.users.push(newUser);
    this.currentId++;
    return newUser;
  }

  getUserById(id: number): UserEntity {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return user;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  findUserByNameAndEmail(email: string, name: string): UserEntity[] {
    let filteredUsers = this.users;

    if (email) {
      filteredUsers = filteredUsers.filter((user) => user.email === email);
    }

    if (name) {
      filteredUsers = filteredUsers.filter((user) => user.name === name);
    }

    if (filteredUsers) {
      return filteredUsers;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  editUser(id: number, updateUserDto: UpdateUserDto): UserEntity {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new BadRequestException('User not found');
    }

    this.users[userIndex].name =
      updateUserDto.name || this.users[userIndex].name;
    this.users[userIndex].email =
      updateUserDto.email || this.users[userIndex].email;

    return this.users[userIndex];
  }

  deleteUser(id: number): UserEntity {
    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1)[0];
      return deletedUser;
    } else {
      throw new BadRequestException('User not found');
    }
  }
}
