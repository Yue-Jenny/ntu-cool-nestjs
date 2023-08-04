import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user/user.entity';

@Injectable()
export class UsersRepository {
  private users: UserEntity[] = [];
  private incrementId = 0;

  public save(newUser: UserEntity): UserEntity {
    this.incrementId++;
    const userId = this.incrementId;
    newUser.id = userId;
    this.users.push(newUser);
    return newUser;
  }

  public getUserById(id: number): UserEntity {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  public getUserByName(name: string): UserEntity[] {
    const user = this.users.filter((user) => user.name === name);
    return user;
  }

  public getUserByEmail(email: string): UserEntity[] {
    const user = this.users.filter((user) => user.email === email);
    return user;
  }

  public getUserByEmailAndName(email: string, name: string): UserEntity[] {
    const user = this.users.filter(
      (user) => user.email === email && user.name === name,
    );
    return user;
  }

  public updateUser(userId: number, name: string, email: string): UserEntity {
    const userIndex = this.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex].name = name || this.users[userIndex].name;
    this.users[userIndex].email = email || this.users[userIndex].email;

    return this.users[userIndex];
  }

  public deleteUserById(userId: number): UserEntity {
    const index = this.users.findIndex((user) => user.id === userId);

    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1)[0];
      return deletedUser;
    } else {
      return null;
    }
  }
}
