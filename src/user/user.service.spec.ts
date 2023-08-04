import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CoursesRepository } from '../course/courses.repository';
import { EnrollmentsRepository } from '../enrollment/enrollment.repository';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UsersRepository,
        CoursesRepository,
        EnrollmentsRepository,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'j@e',
      };

      const newUser = userService.createUser(
        createUserDto.name,
        createUserDto.email,
      );
      expect(newUser.id).toBe(1);
      expect(newUser.name).toBe('John Doe');
      expect(newUser.email).toBe('j@e');
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID if it exists', () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'j@e',
      };

      const user = userService.createUser(
        createUserDto.name,
        createUserDto.email,
      );

      const foundUser = userService.getUserById(user.id);
      expect(foundUser).toEqual(user);
    });

    it('should throw BadRequestException if user is not found', () => {
      expect(() => userService.getUserById(100)).toThrow(BadRequestException);
    });
  });

  describe('findUserByNameAndEmail', () => {
    it('should return filtered users by name and email', () => {
      userService.createUser('John', 'john@example.com');
      userService.createUser('Jane', 'jane@example.com');

      const filteredUsers = userService.findUserByNameAndEmail(
        'john@example.com',
        'John',
      );
      expect(filteredUsers.length).toBe(1);
      expect(filteredUsers[0].name).toBe('John');
      expect(filteredUsers[0].email).toBe('john@example.com');
    });

    it('should return filtered users by email', () => {
      userService.createUser('John', 'g@g');
      userService.createUser('Jane', 'g@e');

      const filteredUsers = userService.findUserByNameAndEmail('g@g', '');
      expect(filteredUsers.length).toBe(1);
      expect(filteredUsers[0].name).toBe('John');
      expect(filteredUsers[0].email).toBe('g@g');
    });
    it('should return filtered users by name', () => {
      userService.createUser('John', 'g@g');
      userService.createUser('Jane', 'g@e');

      const filteredUsers = userService.findUserByNameAndEmail('', 'Jane');
      expect(filteredUsers.length).toBe(1);
      expect(filteredUsers[0].name).toBe('Jane');
      expect(filteredUsers[0].email).toBe('g@e');
    });
    it('should throw BadRequestException if no matching users are found', () => {
      expect(() =>
        userService.findUserByNameAndEmail('nonexistent@example.com', ''),
      ).toThrow(BadRequestException);
    });
  });

  describe('editUser', () => {
    it('should edit the user with the provided ID', () => {
      const user = userService.createUser('John Doe', 'g@g');

      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'g@g',
      };

      const updatedUser = userService.editUser(
        user.id,
        updateUserDto.name,
        updateUserDto.email,
      );
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('g@g');
    });

    it('should throw BadRequestException if user with the provided ID does not exist', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'g@g',
      };
      expect(() =>
        userService.editUser(100, updateUserDto.name, updateUserDto.email),
      ).toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with the provided ID', () => {
      const user = userService.createUser('John Doe', 'h@h');

      const deletedUser = userService.deleteUserById(user.id);
      expect(deletedUser).toEqual(user);
    });

    it('should throw BadRequestException if user with the provided ID does not exist', () => {
      expect(() => userService.deleteUserById(100)).toThrow(
        BadRequestException,
      );
    });
  });
});
