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
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { findUserByNameAndEmailRequestQueryDto } from './dto/find-user-by-name-and-email-request-query.dto';
import { DeleteUserRequestParamDto } from './dto/delete-user-request-param.dto';
import { EditUserRequestParamDto } from './dto/edit-user-request-param.dto';
import { GetUserByIdRequestParamDto } from './dto/get-user-by-id-request-param.dto';
import { instanceToPlain } from 'class-transformer';
import { GetUserByCourseIdRequestParamDto } from './dto/get-user-by-course-reques-param.dto';
import { UserEntity } from '../entity/user/user.entity';
import { AuthGuard } from '../guard/auth.guard';

@Controller('/api')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  /**
   * 1. everyone can create a user by name and email;
   *  a. if email format does not match `/^\S@\S$/`, return Bad Request
   *
   * Advanced requirement: only admin `cool` can create, edit, delete a user;
   * @param createUserDto
   * @returns User
   */
  @Post('/v1/user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    let userEntity: UserEntity = null;
    try {
      const { name, email } = createUserDto;
      userEntity = this.userService.createUser(name, email);
      const userEntityJSON = instanceToPlain(userEntity);
      return userEntityJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        // TODO: 若有機敏資訊，可用 object.delete 刪除該 key
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
        throw error;
      } else {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
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
    let userEntity: UserEntity = null;
    try {
      const { id } = getUserByIdDTO;
      userEntity = this.userService.getUserById(id);
      const userEntityJSON = instanceToPlain(userEntity);
      return userEntityJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
        throw error;
      } else {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
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
    let userEntities: UserEntity[] = [];
    try {
      const { email, name } = queryDTO;
      userEntities = this.userService.findUserByNameAndEmail(email, name);
      const userEntityJSON = instanceToPlain(userEntities);
      return userEntityJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`userEntities: ${JSON.stringify(userEntities)}`);
        throw error;
      } else {
        this.logger.error(`userEntities: ${JSON.stringify(userEntities)}`);
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 4. everyone can edit user's name and user's email by user id;
   *  a. if the user doesn't exist, return Bad Request
   *  b. if email format does not match ``/^\S@\S$/``, return Bad Request
   *
   * Advanced requirement: only admin `cool` can create, edit, delete a user;
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Put('/v1/user/:id')
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  editUser(
    @Param() editDto: EditUserRequestParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    let userEntity: UserEntity = null;
    try {
      const { id } = editDto;
      const { name, email } = updateUserDto;
      userEntity = this.userService.editUser(id, name, email);
      const userEntityJSON = instanceToPlain(userEntity);
      return userEntityJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
        throw error;
      } else {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 5. everyone can delete a user by user id;
   *  a. if the user doesn't exist, return Bad Request
   *
   * Advanced requirement: only admin `cool` can create, edit, delete a user;
   * @param id
   * @returns
   */
  @Delete('/v1/user/:id')
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  deleteUser(@Param() deleteDto: DeleteUserRequestParamDto) {
    let userEntity: UserEntity = null;
    try {
      const { id } = deleteDto;
      userEntity = this.userService.deleteUserById(id);
      const userEntityJSON = instanceToPlain(userEntity);
      return userEntityJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
        throw error;
      } else {
        this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 6. everyone can query users in the course by course id;
   *  a. if the course doesn't exist, return Bad Request
   * @param courseId
   * @returns UserEntity[]
   */
  @Get('/v1/user/:courseId/users')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getUsersByCourseId(@Param() paramDto: GetUserByCourseIdRequestParamDto) {
    let userEntities: UserEntity[] = [];
    try {
      const { courseId } = paramDto;
      userEntities = this.userService.getUsersByCourseId(courseId);
      const userEntitiesJSON = instanceToPlain(userEntities);
      return userEntitiesJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`userEntities: ${JSON.stringify(userEntities)}`);
        throw error;
      } else {
        this.logger.error(`userEntities: ${JSON.stringify(userEntities)}`);
        throw new InternalServerErrorException();
      }
    }
  }
}
