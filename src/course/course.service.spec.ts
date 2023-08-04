import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { UsersRepository } from '../user/users.repository';
import { CoursesRepository } from './courses.repository';
import { EnrollmentsRepository } from '../enrollment/enrollment.repository';
import { UserEntity } from '../entity/user/user.entity';
import { EnrollmentEntity } from '../entity/enrollment/enrollment.entity';
import { Roles } from '../enrollment/roles.enum';
import { BadRequestException } from '@nestjs/common';

describe('CourseService', () => {
  let courseService: CourseService;
  let enrollmentsRepository: EnrollmentsRepository;
  let userRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        UsersRepository,
        CoursesRepository,
        EnrollmentsRepository,
      ],
    }).compile();

    courseService = module.get<CourseService>(CourseService);
    enrollmentsRepository = module.get<EnrollmentsRepository>(
      EnrollmentsRepository,
    );
    userRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('getCourseById', () => {
    it('should get courseEntity with courseId', () => {
      const courseId = 2; // The course exist
      const courseEntity = courseService.getCourseById(courseId);
      expect(courseEntity.id).toBe(courseId);
      expect(courseEntity.name).toBe('成為 Cool 大師的路上');
    });

    it('should throw BadRequestException when course does not exist', () => {
      const courseId = 99; // The course does not exist
      expect(() => courseService.getCourseById(courseId)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCoursesByUserId', () => {
    it('should get courseEntity with userId', () => {
      // 建立測試資料
      const testUser = new UserEntity({
        id: null,
        name: 'jenny',
        email: 'j@d',
      });
      const testUserEntity = userRepository.save(testUser);
      const courseId = 1;
      const testEnrollment = new EnrollmentEntity({
        id: null,
        userId: testUserEntity.id,
        courseId: courseId,
        role: Roles.Student,
      });
      enrollmentsRepository.upsert(testEnrollment);

      const courseEntities = courseService.getCoursesByUserId(
        testUserEntity.id,
      );
      expect(courseEntities[0].id).toBe(courseId);
      expect(courseEntities[0].name).toBe('Software engineering 101');
    });

    it('should throw BadRequestException when user does not exist', () => {
      const userId = 1;
      expect(() => courseService.getCoursesByUserId(userId)).toThrow(
        BadRequestException,
      );
    });
  });
});
