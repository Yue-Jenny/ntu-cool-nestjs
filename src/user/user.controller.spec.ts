import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { findUserByNameAndEmailRequestQueryDto } from './dto/find-user-by-name-and-email-request-query.dto';
import { EditUserRequestParamDto } from './dto/edit-user-request-param.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserRequestParamDto } from './dto/delete-user-request-param.dto';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../entity/user/user.entity';
import { UsersRepository } from './users.repository';
import { CoursesRepository } from '../course/courses.repository';
import { EnrollmentsRepository } from '../enrollment/enrollment.repository';
import { GetUserByIdRequestParamDto } from './dto/get-user-by-id-request-param.dto';
import { instanceToPlain } from 'class-transformer';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UsersRepository,
        CoursesRepository,
        EnrollmentsRepository,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'j@e',
      };

      const createUserEntity = new UserEntity({
        id: 1,
        name: 'John Doe',
        email: 'j@e',
      });
      const createUserEntityJSON = instanceToPlain(createUserEntity);
      jest.spyOn(userService, 'createUser').mockReturnValue(createUserEntity);

      const result = userController.createUser(createUserDto);
      expect(result).toStrictEqual(createUserEntityJSON);
    });
  });

  describe('getUserById', () => {
    it('should return a user by user id', () => {
      const userId = 1;

      const user = new UserEntity({
        id: userId,
        name: 'John Doe',
        email: 'j@e',
      });
      const userJSON = instanceToPlain(user);
      jest.spyOn(userService, 'getUserById').mockReturnValue(user);

      const getUserByIdDTO: GetUserByIdRequestParamDto = {
        id: userId,
      };

      expect(userController.getUserById(getUserByIdDTO)).toStrictEqual(
        userJSON,
      );
    });

    it('should throw BadRequestException when the user does not exist', () => {
      // Assuming user with id 999 does not exist
      const userId = 999;

      jest.spyOn(userService, 'getUserById').mockImplementation(() => {
        throw new BadRequestException('User not found');
      });
      const getUserByIdDTO: GetUserByIdRequestParamDto = {
        id: userId,
      };
      expect(() => userController.getUserById(getUserByIdDTO)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUserByNameAndEmail', () => {
    it('should return a user by email', () => {
      const user = new UserEntity({
        id: 1,
        name: 'John Doe',
        email: 'j@e',
      });
      const userEntities = [user];
      const userEntitiesJSON = instanceToPlain(userEntities);
      jest
        .spyOn(userService, 'findUserByNameAndEmail')
        .mockReturnValue(userEntities);
      const queryDTO: findUserByNameAndEmailRequestQueryDto = {
        name: 'John Doe',
        email: 'j@e',
      };
      expect(userController.findUserByNameAndEmail(queryDTO)).toStrictEqual(
        userEntitiesJSON,
      );
    });

    it('should return a user by name', () => {
      const user = new UserEntity({
        id: 1,
        name: 'John Doe',
        email: 'j@e',
      });
      const userEntities = [user];
      const userEntitiesJSON = instanceToPlain(userEntities);
      jest
        .spyOn(userService, 'findUserByNameAndEmail')
        .mockReturnValue(userEntities);
      const queryDTO: findUserByNameAndEmailRequestQueryDto = {
        name: 'John Doe',
        email: 'j@e',
      };
      expect(userController.findUserByNameAndEmail(queryDTO)).toStrictEqual(
        userEntitiesJSON,
      );
    });
    it('should throw BadRequestException when the user does not exist', () => {
      jest
        .spyOn(userService, 'findUserByNameAndEmail')
        .mockImplementation(() => {
          throw new BadRequestException('User not found');
        });

      const queryDTO: findUserByNameAndEmailRequestQueryDto = {
        name: 'John Doe',
        email: 'j@e',
      };
      expect(() => userController.findUserByNameAndEmail(queryDTO)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('editUser', () => {
    it('should edit user name and email by user id', () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
        email: 'n@e',
      };
      const updatedUser = new UserEntity({
        id: userId,
        name: 'New Name',
        email: 'n@e',
      });
      const updatedUserJSON = instanceToPlain(updatedUser);

      jest.spyOn(userService, 'editUser').mockReturnValue(updatedUser);
      const editDto: EditUserRequestParamDto = { id: userId };
      expect(userController.editUser(editDto, updateUserDto)).toStrictEqual(
        updatedUserJSON,
      );
    });

    it('should throw BadRequestException when the user does not exist', () => {
      // Assuming user with id 999 does not exist
      const userId = 999;
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
        email: 'n@e',
      };

      jest.spyOn(userService, 'editUser').mockImplementation(() => {
        throw new BadRequestException('User not found');
      });

      const editDto: EditUserRequestParamDto = { id: userId };
      expect(() => userController.editUser(editDto, updateUserDto)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by user id', () => {
      const userId = 1;
      const user = new UserEntity({
        id: userId,
        name: 'John Doe',
        email: 'j@e',
      });
      const userJSON = instanceToPlain(user);
      jest.spyOn(userService, 'deleteUserById').mockReturnValue(user);
      const deleteDto: DeleteUserRequestParamDto = { id: userId };
      expect(userController.deleteUser(deleteDto)).toStrictEqual(userJSON);
    });

    it('should throw BadRequestException when the user does not exist', () => {
      // Assuming user with id 999 does not exist
      const userId = 999;

      jest.spyOn(userService, 'deleteUserById').mockImplementation(() => {
        throw new BadRequestException('User not found');
      });

      const deleteDto: DeleteUserRequestParamDto = { id: userId };
      expect(() => userController.deleteUser(deleteDto)).toThrow(
        BadRequestException,
      );
    });
  });
});
