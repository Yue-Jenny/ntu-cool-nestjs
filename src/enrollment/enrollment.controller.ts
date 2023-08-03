import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { GetEnrollmentsByCourseQueryDto } from './dto/get-enrollments-by-course-query.dto';
import { WithDrawUserDto } from './dto/withdraw-enrollment.dto';
import { GetEnrollmentsByCourseParamDto } from './dto/get-enrollments-by-course-param.dto';
import { GetEnrollmentsByEnrollmentParamDto } from './dto/get-enrollment-by-enrollment-param.dto';
import { GetEnrollmentsByUserParamDto } from './dto/get-enrollment-by-user-param.dto';
import { GetEnrollmentsByUserQueryDto } from './dto/get-enrollment-by-user-query.dto';
import { instanceToPlain } from 'class-transformer';
import { EnrollmentEntity } from '../entity/enrollment/enrollment.entity';

@Controller('/api')
export class EnrollmentController {
  private readonly logger = new Logger(EnrollmentController.name);
  constructor(private enrollmentService: EnrollmentService) {}

  /**
   *  2. everyone can enroll a user to a course by user id, course id and role;
   *   a. if the user, the course or the role doesn't exist, return Bad Request
   * @param enrollmentDto
   * @returns
   */
  @Post('/v1/enrollment')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  enrollUser(@Body() enrollmentDto: CreateEnrollmentDto) {
    let enrollmentEntity: EnrollmentEntity = null;
    try {
      const { userId, courseId, role } = enrollmentDto;
      enrollmentEntity = this.enrollmentService.enrollUser(
        userId,
        courseId,
        role,
      );
      const enrollmentJSON = instanceToPlain(enrollmentEntity);
      return enrollmentJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(
          `enrollmentEntity: ${JSON.stringify(enrollmentEntity)}`,
        );
        throw error;
      } else {
        this.logger.error(
          `enrollmentEntity: ${JSON.stringify(enrollmentEntity)}`,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   *  3. everyone can withdraw a user by enrollment id;
   *    a. if the enrollment doesn't exist, return Bad Request
   *    b. 如同項目 2 , 若 user 不存在回傳 Bad Request
   * @param enrollmentId
   * @returns
   */
  @Delete('/v1/enrollment/:enrollmentId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  withdrawUserByEnrollmentId(@Param() withdrawUserDto: WithDrawUserDto) {
    let enrollmentEntity: EnrollmentEntity = null;
    try {
      const { enrollmentId } = withdrawUserDto;
      enrollmentEntity =
        this.enrollmentService.withdrawUserByEnrollmentId(enrollmentId);
      const enrollmentJSON = instanceToPlain(enrollmentEntity);
      return enrollmentJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(
          `enrollmentEntity: ${JSON.stringify(enrollmentEntity)}`,
        );
        throw error;
      } else {
        this.logger.error(
          `enrollmentEntity: ${JSON.stringify(enrollmentEntity)}`,
        );
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 4. everyone can get an enrollment by enrollment id;
   * @param enrollmentId
   * @returns
   */
  @Get('/v1/enrollment/:enrollmentId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getEnrollmentByEnrollmentId(
    @Param() paramDto: GetEnrollmentsByEnrollmentParamDto,
  ) {
    let enrollmentEntity: EnrollmentEntity = null;

    try {
      const { enrollmentId } = paramDto;
      enrollmentEntity =
        this.enrollmentService.getEnrollmentByEnrollmentId(enrollmentId);

      const enrollmentJSON = instanceToPlain(enrollmentEntity);
      return enrollmentJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(
          `enrollmentEntity: ${JSON.stringify(enrollmentEntity)}`,
        );
        throw error;
      } else {
        this.logger.error(
          `enrollmentEntity: ${JSON.stringify(enrollmentEntity)}`,
        );
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 5. everyone can query enrollments in the course by course id, and filter by role or user id;
   *  a. use a query string to specify a role or user id. like: ``/?userId=1&role=student``
   *  b. if the course doesn't exist, return Bad Request
   * @param courseId
   * @param query
   * @returns
   */
  @Get('/v1/enrollment/course/:courseId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getEnrollmentsByCourseIdAndFilterByUserIdAndRole(
    @Param() paramDto: GetEnrollmentsByCourseParamDto,
    @Query() queryDto: GetEnrollmentsByCourseQueryDto,
  ) {
    let enrollmentEntites: EnrollmentEntity[] = [];

    try {
      const { courseId } = paramDto;
      const { userId, role } = queryDto;

      // if the course doesn't exist, return Bad Request
      this.enrollmentService.getCourseById(courseId);

      enrollmentEntites =
        this.enrollmentService.getEnrollmentsByMultiConditions(
          userId,
          courseId,
          role,
        );

      const enrollmentJSON = instanceToPlain(enrollmentEntites);
      return enrollmentJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(
          `enrollmentEntites: ${JSON.stringify(enrollmentEntites)}`,
        );
        throw error;
      } else {
        this.logger.error(
          `enrollmentEntites: ${JSON.stringify(enrollmentEntites)}`,
        );
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 6. everyone can query enrollments by user id, and filter by role or course id;
   *  a. use a query string to specify a role or course id. like: ``/?role=student``
   *  b. if the user doesn't exist, return Bad Request
   * @param userId
   * @param query
   * @returns
   */
  @Get('/v1/enrollment/user/:userId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getEnrollmentsByUserIdAndFilterByRoleAndCourseId(
    @Param() paramDto: GetEnrollmentsByUserParamDto,
    @Query() queryDto: GetEnrollmentsByUserQueryDto,
  ) {
    let enrollmentEntites: EnrollmentEntity[] = [];
    try {
      const { userId } = paramDto;
      const { courseId, role } = queryDto;

      // if the user doesn't exist, return Bad Request
      this.enrollmentService.getUserById(userId);

      enrollmentEntites =
        this.enrollmentService.getEnrollmentsByMultiConditions(
          userId,
          courseId,
          role,
        );
      const enrollmentJSON = instanceToPlain(enrollmentEntites);

      return enrollmentJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(
          `enrollmentEntites: ${JSON.stringify(enrollmentEntites)}`,
        );
        throw error;
      } else {
        this.logger.error(
          `enrollmentEntites: ${JSON.stringify(enrollmentEntites)}`,
        );
        throw new InternalServerErrorException();
      }
    }
  }
}
