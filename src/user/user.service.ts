import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user/user.entity';
import { UsersRepository } from './users.repository';
import { EnrollmentsRepository } from '../enrollment/enrollment.repository';
import { CoursesRepository } from '../course/courses.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private courseRepository: CoursesRepository,
    private enrollmentRepository: EnrollmentsRepository,
  ) {}

  createUser(name: string, email: string): UserEntity {
    const newUser = new UserEntity({
      id: null,
      name: name,
      email: email,
    });

    this.userRepository.save(newUser);
    return newUser;
  }

  getUserById(id: number): UserEntity {
    const user = this.userRepository.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new BadRequestException('User not found');
    }
  }

  findUserByNameAndEmail(email: string, name: string): UserEntity[] {
    // query string to specify name
    if (name && !email) {
      const userByName = this.userRepository.getUserByName(name);
      if (userByName.length === 0) {
        throw new BadRequestException('User not found.');
      }
      return userByName;
    }

    // query string to specify email
    if (email && !name) {
      const userByEmail = this.userRepository.getUserByEmail(email);
      if (userByEmail.length === 0) {
        throw new BadRequestException('User not found.');
      }
      return userByEmail;
    }

    // query string to specify name and email
    if (email && name) {
      const userByEmailAndName = this.userRepository.getUserByEmailAndName(
        email,
        name,
      );
      if (userByEmailAndName.length === 0) {
        throw new BadRequestException('User not found.');
      }
      return userByEmailAndName;
    }

    throw new BadRequestException('User not found.');
  }
  editUser(id: number, name: string, email: string): UserEntity {
    const updatedUser = this.userRepository.updateUser(id, name, email);
    if (!updatedUser) {
      throw new BadRequestException('User not found.');
    }
    return updatedUser;
  }

  deleteUserById(id: number): UserEntity {
    const deletedUser = this.userRepository.deleteUserById(id);
    if (!deletedUser) {
      throw new BadRequestException('User not found');
    }
    return deletedUser;
  }

  getUsersByCourseId(courseId: number): UserEntity[] {
    const course = this.courseRepository.getCourseById(courseId);
    if (!course) {
      throw new BadRequestException();
    }

    const enrollments =
      this.enrollmentRepository.getEnrollmentsByCourseId(courseId);

    // 從 enrollements 結果中取得所有 userIds
    // 利用 userIds 取得相對應的 users, 並包裝為 UserEntity 物件回傳。
    const userEntities = [];
    enrollments.forEach((item) => {
      const matchedUser = this.userRepository.getUserById(item.userId);
      const userEntity = new UserEntity({
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
      });
      userEntities.push(userEntity);
    });

    return userEntities;
  }
}
