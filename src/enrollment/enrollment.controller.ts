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
  UseGuards,
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
import { AuthGuard } from '../guard/auth.guard';

@Controller('/api')
export class EnrollmentController {
  private readonly logger = new Logger(EnrollmentController.name);
  constructor(private enrollmentService: EnrollmentService) {}

  /**
   * 7. everyone can enroll a user to a course by user id, course id and role;
   *   a. if the user, the course or the role doesn't exist, return Bad Request
   *
   * Advanced requirement: only admin `cool` can create, edit, delete a user;
   *
   * @route POST /api/v1/enrollment
   * @param {CreateEnrollmentDto} enrollmentDto - The object containing enrollment data.
   * @param {string} enrollmentDto.userId - The ID of the user to be enrolled.
   * @param {string} enrollmentDto.courseId - The ID of the course to enroll the user in.
   * @param {string} enrollmentDto.role - The role of the user in the course.
   * @returns {EnrollmentEntity} - The newly created enrollment entity.
   * @throws {BadRequestException} If the user, course, or role doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during enrollment creation.
   */
  @Post('/v1/enrollment')
  @UseGuards(AuthGuard)
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
   *  8. everyone can withdraw a user by enrollment id;
   *    a. if the enrollment doesn't exist, return Bad Request
   *
   * Advanced requirement: only admin `cool` can create, edit, delete a user;
   *
   * @route DELETE /api/v1/enrollment/:enrollmentId
   * @param {WithDrawUserDto} withdrawUserDto - The object containing withdrawal enrollment data.
   * @param {string} withdrawUserDto.enrollmentId - The ID of the enrollment to be withdrawn.
   * @returns {EnrollmentEntity} - The enrollment entity of the withdrawn user.
   * @throws {BadRequestException} If the enrollment doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during withdrawal.
   */
  @Delete('/v1/enrollment/:enrollmentId')
  @UseGuards(AuthGuard)
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
   * 9. everyone can get an enrollment by enrollment id;
   *
   * @route GET /api/v1/enrollment/:enrollmentId
   * @param {GetEnrollmentsByEnrollmentParamDto} paramDto - The object contains enrollment data for the query.
   * @param {string} paramDto.enrollmentId - The ID of the enrollment to retrieve.
   * @returns {EnrollmentEntity} - The enrollment entity.
   * @throws {BadRequestException} If the enrollment doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during retrieval.
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
   * 10. everyone can query enrollments in the course by course id, and filter by role or user id;
   *  a. use a query string to specify a role or user id. like: ``/?userId=1&role=student``
   *  b. if the course doesn't exist, return Bad Request
   *
   * @route GET /api/v1/enrollment/course/:courseId
   * @param {GetEnrollmentsByCourseParamDto} paramDto - The object containing required query parameters.
   * @param {string} paramDto.courseId - The ID of the course to retrieve enrollments from.
   * @param {GetEnrollmentsByCourseQueryDto} queryDto - The object containing optional query parameters.
   * @param {string} queryDto.userId - The ID of the user to filter enrollments (optional).
   * @param {string} queryDto.role - The role of the user to filter enrollments (optional).
   * @returns {EnrollmentEntity[]} - An array of enrollment entities in the course that match the filters.
   * @throws {BadRequestException} If the course doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during retrieval.
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

      enrollmentEntites =
        this.enrollmentService.getEnrollmentsByCourseIdAndFilterByUserIdAndRole(
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
   * 11. everyone can query enrollments by user id, and filter by role or course id;
   *  a. use a query string to specify a role or course id. like: ``/?role=student``
   *  b. if the user doesn't exist, return Bad Request
   *
   * @route GET /api/v1/enrollment/user/:userId
   * @param {GetEnrollmentsByUserParamDto} paramDto - The object containing required query parameters.
   * @param {string} paramDto.userId - The ID of the user to retrieve enrollments.
   * @param {GetEnrollmentsByUserQueryDto} queryDto - The object containing optional query parameters.
   * @param {string} queryDto.courseId - The ID of the course to filter enrollments (optional).
   * @param {string} queryDto.role - The role of the user to filter enrollments (optional).
   * @returns {EnrollmentEntity[]} - An array of enrollment entities for the user that match the filters.
   * @throws {BadRequestException} If the user doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during retrieval.
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

      enrollmentEntites =
        this.enrollmentService.getEnrollmentsByUserIdAndFilterByRoleAndCourseId(
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
