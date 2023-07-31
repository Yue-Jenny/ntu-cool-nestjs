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

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
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

      jest.spyOn(userService, 'createUser').mockReturnValue(createUserEntity);

      const result = userController.createUser(createUserDto);
      expect(result).toEqual(createUserEntity);
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

      jest.spyOn(userService, 'getUserById').mockReturnValue(user);
      expect(userController.getUserById({ id: userId })).toEqual(user);
    });

    it('should throw BadRequestException when the user does not exist', () => {
      // Assuming user with id 999 does not exist
      const userId = 999;

      jest.spyOn(userService, 'getUserById').mockImplementation(() => {
        throw new BadRequestException('User not found');
      });

      expect(() => userController.getUserById({ id: userId })).toThrow(
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

      jest.spyOn(userService, 'findUserByNameAndEmail').mockReturnValue([user]);
      const queryDTO: findUserByNameAndEmailRequestQueryDto = {
        name: 'John Doe',
        email: 'j@e',
      };
      expect(userController.findUserByNameAndEmail(queryDTO)).toEqual([user]);
    });

    it('should return a user by name', () => {
      const user = new UserEntity({
        id: 1,
        name: 'John Doe',
        email: 'j@e',
      });
      jest.spyOn(userService, 'findUserByNameAndEmail').mockReturnValue([user]);
      const queryDTO: findUserByNameAndEmailRequestQueryDto = {
        name: 'John Doe',
        email: 'j@e',
      };
      expect(userController.findUserByNameAndEmail(queryDTO)).toEqual([user]);
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

      jest.spyOn(userService, 'editUser').mockReturnValue(updatedUser);
      const editDto: EditUserRequestParamDto = { id: userId };
      expect(userController.editUser(editDto, updateUserDto)).toEqual(
        updatedUser,
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

      jest.spyOn(userService, 'deleteUser').mockReturnValue(user);
      const deleteDto: DeleteUserRequestParamDto = { id: userId };
      expect(userController.deleteUser(deleteDto)).toEqual(user);
    });

    it('should throw BadRequestException when the user does not exist', () => {
      // Assuming user with id 999 does not exist
      const userId = 999;

      jest.spyOn(userService, 'deleteUser').mockImplementation(() => {
        throw new BadRequestException('User not found');
      });

      const deleteDto: DeleteUserRequestParamDto = { id: userId };
      expect(() => userController.deleteUser(deleteDto)).toThrow(
        BadRequestException,
      );
    });
  });
});
