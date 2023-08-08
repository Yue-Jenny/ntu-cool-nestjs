import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { instanceToPlain } from 'class-transformer';
import { GetCourseByIdRequestParamDto } from './dto/get-course-by-id-request-param.dto';
import { GetCourseByUserIdRequestParamDto } from './dto/get-course-by-userId-request-param.dto';
import { CourseEntity } from '../entity/course/course.entity';

@Controller('/api')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);
  constructor(private courseService: CourseService) {}

  /**
   * 12. everyone can get a course by course id;
   *  a. if the course doesn't exist, return Bad Request
   *
   * @route GET /api/v1/course/:courseId
   * @param {GetCourseByIdRequestParamDto} paramDto - The object containing enrollment data.
   * @param {string} paramDto.courseId - The ID of the course to retrieve.
   * @returns {paramDto} - The course entity.
   * @throws {BadRequestException} If the course doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during the query.
   */
  @Get('/v1/course/:courseId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getCourseById(@Param() paramDto: GetCourseByIdRequestParamDto) {
    let courseEntity: CourseEntity = null;
    try {
      const { courseId } = paramDto;
      courseEntity = this.courseService.getCourseById(courseId);
      const courseEntityJSON = instanceToPlain(courseEntity);
      return courseEntityJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`courseEntity: ${JSON.stringify(courseEntity)}`);
        throw error;
      } else {
        this.logger.error(`courseEntity: ${JSON.stringify(courseEntity)}`);
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * 13. everyone can query courses by user id ;
   *  a. if the user doesn't exist, return Bad Request
   *
   * @route GET /api/v1/course/users/:userId
   * @param {GetCourseByUserIdRequestParamDto} paramDto - The object containing enrollment data.
   * @param {string} paramDto.userId - The ID of the user to retrieve courses for.
   * @returns {CourseEntity[]} - An array of course entities for the user.
   * @throws {BadRequestException} If the user doesn't exist or input data is invalid.
   * @throws {InternalServerErrorException} If there's an internal server error during the query.
   */
  @Get('/v1/course/users/:userId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  getCoursesByUserId(@Param() paramDto: GetCourseByUserIdRequestParamDto) {
    let courseEntities: CourseEntity[] = null;
    try {
      const { userId } = paramDto;
      courseEntities = this.courseService.getCoursesByUserId(userId);
      const courseEntitiesJSON = instanceToPlain(courseEntities);
      return courseEntitiesJSON;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error(`courseEntities: ${JSON.stringify(courseEntities)}`);
        throw error;
      } else {
        this.logger.error(`courseEntities: ${JSON.stringify(courseEntities)}`);
        throw new InternalServerErrorException();
      }
    }
  }
}
