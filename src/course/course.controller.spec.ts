import { Test } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UsersRepository } from '../user/users.repository';
import { CoursesRepository } from './courses.repository';
import { EnrollmentsRepository } from '../enrollment/enrollment.repository';
import { BadRequestException } from '@nestjs/common';
import { GetCourseByIdRequestParamDto } from './dto/get-course-by-id-request-param.dto';
import { GetCourseByUserIdRequestParamDto } from './dto/get-course-by-userId-request-param.dto';
import { CourseEntity } from '../entity/course/course.entity';

describe('CourseController', () => {
  let courseController: CourseController;
  let courseService: CourseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        CourseService,
        UsersRepository,
        CoursesRepository,
        EnrollmentsRepository,
      ],
    }).compile();
    courseController = module.get<CourseController>(CourseController);
    courseService = module.get<CourseService>(CourseService);
  });

  describe('getCourseById', () => {
    it('should get courseEntity with courseId', () => {
      const getCourseByIdRequestParamDto: GetCourseByIdRequestParamDto = {
        courseId: 1,
      };
      const mockCourseEntity = new CourseEntity({
        id: 1,
        name: 'lesson 1',
      });

      jest
        .spyOn(courseService, 'getCourseById')
        .mockReturnValue(mockCourseEntity);

      const courseEntity = courseController.getCourseById(
        getCourseByIdRequestParamDto,
      );

      expect(courseEntity.id).toBe(mockCourseEntity.id);
      expect(courseEntity.name).toBe(mockCourseEntity.name);
    });
    it('should throw BadRequestException when the course does not exist', () => {
      const getCourseByIdRequestParamDto: GetCourseByIdRequestParamDto = {
        courseId: 99, // The course does not exist
      };

      jest.spyOn(courseService, 'getCourseById').mockImplementation(() => {
        throw new BadRequestException('Course not found.');
      });

      expect(() =>
        courseController.getCourseById(getCourseByIdRequestParamDto),
      ).toThrow(BadRequestException);
    });
  });

  describe('getCoursesByUserId', () => {
    it('should get courseEntities with userId', () => {
      const mockCourseEntity = new CourseEntity({
        id: 1,
        name: 'lesson 1',
      });
      const mockCourseEntities = [mockCourseEntity];
      jest
        .spyOn(courseService, 'getCoursesByUserId')
        .mockReturnValue(mockCourseEntities);

      // 測試 courseController.getCoursesByUserId
      const getCourseByUserIdRequestParamDto: GetCourseByUserIdRequestParamDto =
        { userId: 1 };

      const courseEntities = courseController.getCoursesByUserId(
        getCourseByUserIdRequestParamDto,
      );
      expect(courseEntities[0].id).toBe(mockCourseEntities[0].id);
      expect(courseEntities[0].name).toBe(mockCourseEntities[0].name);
    });
    it('should throw BadRequestException when the user does not exist', () => {
      const getCourseByUserIdRequestParamDto: GetCourseByUserIdRequestParamDto =
        {
          userId: 99, // The user does not exist
        };

      jest.spyOn(courseService, 'getCoursesByUserId').mockImplementation(() => {
        throw new BadRequestException();
      });

      expect(() =>
        courseController.getCoursesByUserId(getCourseByUserIdRequestParamDto),
      ).toThrow(BadRequestException);
    });
  });
});
