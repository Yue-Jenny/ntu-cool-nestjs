import { Test } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { WithDrawUserDto } from './dto/withdraw-enrollment.dto';
import { Roles } from './roles.enum';
import { EnrollmentEntity } from '../entity/enrollment/enrollment.entity';
import { UsersRepository } from '../user/users.repository';
import { CoursesRepository } from '../course/courses.repository';
import { EnrollmentsRepository } from './enrollment.repository';
import { instanceToPlain } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { GetEnrollmentsByEnrollmentParamDto } from './dto/get-enrollment-by-enrollment-param.dto';
import { GetEnrollmentsByCourseQueryDto } from './dto/get-enrollments-by-course-query.dto';
import { GetEnrollmentsByCourseParamDto } from './dto/get-enrollments-by-course-param.dto';
import { GetEnrollmentsByUserParamDto } from './dto/get-enrollment-by-user-param.dto';
import { GetEnrollmentsByUserQueryDto } from './dto/get-enrollment-by-user-query.dto';

describe('EnrollmentController', () => {
  let enrollmentController: EnrollmentController;
  let enrollmentService: EnrollmentService;
  let userRepository: UsersRepository;
  let courseRepository: CoursesRepository;
  let enrollmentRepository: EnrollmentsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        EnrollmentService,
        UsersRepository,
        CoursesRepository,
        EnrollmentsRepository,
      ],
    }).compile();

    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
    enrollmentController =
      module.get<EnrollmentController>(EnrollmentController);
    userRepository = module.get<UsersRepository>(UsersRepository);
    courseRepository = module.get<CoursesRepository>(CoursesRepository);
    enrollmentRepository = module.get<EnrollmentsRepository>(
      EnrollmentsRepository,
    );
  });

  describe('enrollUser', () => {
    it('should call enrollmentService.enrollUser and return the result', () => {
      const enrollmentDto: CreateEnrollmentDto = {
        userId: 1,
        courseId: 2,
        role: Roles.Student,
      };
      const expectedResult = new EnrollmentEntity({
        id: 1,
        userId: 1,
        courseId: 2,
        role: Roles.Student,
      });

      jest
        .spyOn(enrollmentService, 'enrollUser')
        .mockReturnValue(expectedResult);

      const result = enrollmentController.enrollUser(enrollmentDto);

      expect(enrollmentService.enrollUser).toHaveBeenCalledWith(
        1,
        2,
        'student',
      );
      expect(result).toStrictEqual(instanceToPlain(expectedResult));
    });
    it('should throw BadRequestException when the user or the course does not exist', () => {
      const enrollmentDto: CreateEnrollmentDto = {
        userId: 1,
        courseId: 2,
        role: Roles.Student,
      };

      jest.spyOn(enrollmentService, 'enrollUser').mockImplementation(() => {
        throw new BadRequestException('User or course not found.');
      });

      expect(() => enrollmentController.enrollUser(enrollmentDto)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('withdrawUserByEnrollmentId', () => {
    it('should call enrollmentService.withdrawUserByEnrollmentId and return the result', async () => {
      const withdrawUserDto: WithDrawUserDto = {
        enrollmentId: 123,
      };
      const expectedResult = new EnrollmentEntity({
        id: 123,
        userId: 1,
        courseId: 2,
        role: Roles.Student,
      });

      jest
        .spyOn(enrollmentService, 'withdrawUserByEnrollmentId')
        .mockReturnValue(expectedResult);

      const result =
        enrollmentController.withdrawUserByEnrollmentId(withdrawUserDto);

      expect(enrollmentService.withdrawUserByEnrollmentId).toHaveBeenCalledWith(
        123,
      );
      expect(result).toStrictEqual(instanceToPlain(expectedResult));
    });

    it('should throw BadRequestException when the enrollment does not exist', () => {
      const enrollmentId = 999;

      jest
        .spyOn(enrollmentService, 'withdrawUserByEnrollmentId')
        .mockImplementation(() => {
          throw new BadRequestException('Enrollment not found.');
        });

      expect(() =>
        enrollmentController.withdrawUserByEnrollmentId({ enrollmentId }),
      ).toThrow(BadRequestException);
    });
  });

  describe('getEnrollmentByEnrollmentId', () => {
    it('should call enrollmentService.getEnrollmentByEnrollmentId and return the result', () => {
      const paramDto: GetEnrollmentsByEnrollmentParamDto = {
        enrollmentId: 123,
      };

      const expectedEnrollment = new EnrollmentEntity({
        id: 123,
        userId: 1,
        courseId: 1,
        role: Roles.Student,
      });

      const expectedEnrollmentJSON = instanceToPlain(expectedEnrollment);

      jest
        .spyOn(enrollmentService, 'getEnrollmentByEnrollmentId')
        .mockReturnValue(expectedEnrollment);

      const enrollmentEntity =
        enrollmentController.getEnrollmentByEnrollmentId(paramDto);

      expect(
        enrollmentService.getEnrollmentByEnrollmentId,
      ).toHaveBeenCalledWith(123);

      expect(enrollmentEntity).toStrictEqual(expectedEnrollmentJSON);
    });
  });

  describe('getEnrollmentsByCourseIdAndFilterByUserIdAndRole', () => {
    it('should call enrollmentService.getEnrollmentsByMultiConditions with courseId, userId and role, and then return the result', () => {
      const paramDto: GetEnrollmentsByCourseParamDto = {
        courseId: 1,
      };
      const queryDto: GetEnrollmentsByCourseQueryDto = {
        userId: 2,
        role: Roles.Student,
      };

      const expectedEnrollmentId1 = new EnrollmentEntity({
        id: 1,
        userId: 2,
        courseId: 1,
        role: Roles.Student,
      });
      const expectedEnrollments: EnrollmentEntity[] = [expectedEnrollmentId1];
      const expectedEnrollmentsJSON = instanceToPlain(expectedEnrollments);

      jest
        .spyOn(
          enrollmentService,
          'getEnrollmentsByCourseIdAndFilterByUserIdAndRole',
        )
        .mockReturnValue(expectedEnrollments);

      const result =
        enrollmentController.getEnrollmentsByCourseIdAndFilterByUserIdAndRole(
          paramDto,
          queryDto,
        );

      expect(result).toStrictEqual(expectedEnrollmentsJSON);
    });

    it('should throw BadRequestException when the course does not exist', () => {
      const paramDto: GetEnrollmentsByCourseParamDto = {
        courseId: 99, // The course does not exist
      };
      const queryDto: GetEnrollmentsByCourseQueryDto = {
        userId: 2,
        role: Roles.Student,
      };

      jest
        .spyOn(
          enrollmentService,
          'getEnrollmentsByCourseIdAndFilterByUserIdAndRole',
        )
        .mockImplementation(() => {
          throw new BadRequestException('Course not found');
        });

      expect(() =>
        enrollmentController.getEnrollmentsByCourseIdAndFilterByUserIdAndRole(
          paramDto,
          queryDto,
        ),
      ).toThrow(BadRequestException);
    });
  });

  describe('getEnrollmentsByUserIdAndFilterByRoleAndCourseId', () => {
    it('should call enrollmentService.getEnrollmentsByMultiConditions with userId, courseId and role, and return the result', () => {
      const paramDto: GetEnrollmentsByUserParamDto = {
        userId: 1,
      };
      const queryDto: GetEnrollmentsByUserQueryDto = {
        courseId: 2,
        role: Roles.Student,
      };

      const expectedEnrollment = new EnrollmentEntity({
        id: 1,
        userId: 1,
        courseId: 2,
        role: Roles.Student,
      });

      const expectedEnrollments: EnrollmentEntity[] = [expectedEnrollment];
      const expectedEnrollmentsJSON = instanceToPlain(expectedEnrollments);

      jest
        .spyOn(
          enrollmentService,
          'getEnrollmentsByUserIdAndFilterByRoleAndCourseId',
        )
        .mockReturnValue(expectedEnrollments);

      const enrollmentEntities =
        enrollmentController.getEnrollmentsByUserIdAndFilterByRoleAndCourseId(
          paramDto,
          queryDto,
        );

      expect(enrollmentEntities).toStrictEqual(expectedEnrollmentsJSON);
    });

    it('should throw BadRequestException when the user does not exist', () => {
      const paramDto: GetEnrollmentsByUserParamDto = {
        userId: 100,
      };
      const queryDto: GetEnrollmentsByUserQueryDto = {
        courseId: 1,
        role: Roles.Student,
      };

      jest
        .spyOn(
          enrollmentService,
          'getEnrollmentsByUserIdAndFilterByRoleAndCourseId',
        )
        .mockImplementation(() => {
          throw new BadRequestException('User not found');
        });

      expect(() =>
        enrollmentController.getEnrollmentsByUserIdAndFilterByRoleAndCourseId(
          paramDto,
          queryDto,
        ),
      ).toThrow(BadRequestException);
    });
  });
});
