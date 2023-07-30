import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
  UsePipes,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { findUserByNameAndEmailRequestQueryDto } from './dto/find-user-by-name-and-email-request-query.dto';
import { DeleteUserRequestParamDto } from './dto/delete-user-request-param.dto';
import { EditUserRequestParamDto } from './dto/edit-user-request-param.dto';
import { GetUserByIdRequestParamDto } from './dto/get-user-by-id-request-param.dto';
import { instanceToPlain } from 'class-transformer';

@Controller('/api')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 1. everyone can create a user by name and email;
   *  a. if email format does not match `/^\S@\S$/`, return Bad Request
   * @param createUserDto
   * @returns User
   */
  @Post('/v1/user')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return instanceToPlain(this.userService.createUser(createUserDto));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 2. everyone can get a user by user id;
   *  a. if the user doesn't exist, return Bad Request
   * @param id
   * @returns
   */
  @Get('/v1/user/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getUserById(@Param() getUserByIdDTO: GetUserByIdRequestParamDto) {
    try {
      const { id } = getUserByIdDTO;
      return instanceToPlain(this.userService.getUserById(id));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 3. everyone can query a user by email or name;
   *  a. use query string to specify email or name
   *  b. if email format does not match ``/^\S@\S$/``, return Bad Request
   * @param email
   * @param name
   * @returns
   */
  @Get('/v1/user')
  @UsePipes(new ValidationPipe())
  findUserByNameAndEmail(
    @Query() queryDTO: findUserByNameAndEmailRequestQueryDto,
  ) {
    try {
      const { email, name } = queryDTO;
      return instanceToPlain(
        this.userService.findUserByNameAndEmail(email, name),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 4. everyone can edit user's name and user's email by user id;
   *  a. if the user doesn't exist, return Bad Request
   *  b. if email format does not match ``/^\S@\S$/``, return Bad Request
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Put('/v1/user/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  editUser(
    @Param() editDto: EditUserRequestParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const { id } = editDto;
      return instanceToPlain(this.userService.editUser(id, updateUserDto));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 5. everyone can delete a user by user id;
   *  a. if the user doesn't exist, return Bad Request
   * @param id
   * @returns
   */
  @Delete('/v1/user/:id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  deleteUser(@Param() deleteDto: DeleteUserRequestParamDto) {
    try {
      const { id } = deleteDto;
      return instanceToPlain(this.userService.deleteUser(id));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
