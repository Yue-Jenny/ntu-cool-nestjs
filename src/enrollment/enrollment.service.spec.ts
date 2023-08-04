import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { UsersRepository } from '../user/users.repository';
import { CoursesRepository } from '../course/courses.repository';
import { EnrollmentsRepository } from './enrollment.repository';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../entity/user/user.entity';
import { Roles } from './roles.enum';
import { EnrollmentEntity } from '../entity/enrollment/enrollment.entity';

describe('EnrollmentService', () => {
  let enrollmentService: EnrollmentService;
  let userRepository: UsersRepository;
  let courseRepository: CoursesRepository;
  let enrollmentRepository: EnrollmentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        UsersRepository,
        CoursesRepository,
        EnrollmentsRepository,
      ],
    }).compile();

    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
    userRepository = module.get<UsersRepository>(UsersRepository);
    courseRepository = module.get<CoursesRepository>(CoursesRepository);
    enrollmentRepository = module.get<EnrollmentsRepository>(
      EnrollmentsRepository,
    );
  });

  describe('enrollUser', () => {
    it('should enroll a user to a course with valid inputs', () => {
      const testUser = new UserEntity({
        id: null,
        name: 'Test User',
        email: 'a@f',
      });

      // 建立測試資料
      const courseId = 1;
      const userEntity = userRepository.save(testUser);
      const enrollmentEntity = new EnrollmentEntity({
        id: null,
        userId: userEntity.id,
        courseId: courseId,
        role: Roles.Student,
      });
      const upsertEnrollmentEntityResult =
        enrollmentRepository.upsert(enrollmentEntity);

      const enrollment = enrollmentService.enrollUser(
        testUser.id,
        courseId,
        Roles.Student,
      );

      expect(enrollment).toStrictEqual(upsertEnrollmentEntityResult);
    });

    it('should throw BadRequestException when user or course is not found', () => {
      const userId = 1;
      const courseId = 99; // The course does not exist.
      const enrollUserCall = () =>
        enrollmentService.enrollUser(userId, courseId, Roles.Student);

      expect(enrollUserCall).toThrow(BadRequestException);
    });

    describe('withdrawUserByEnrollmentId', () => {
      it('should withdraw a user from an enrollment with a valid enrollmentId', () => {
        // 建立測試資料
        const testUser = new UserEntity({
          id: null,
          name: 'Test User',
          email: 'a@f',
        });
        const testUserEntity = userRepository.save(testUser);

        const courseId = 1;
        const testEnrollmentEntity = new EnrollmentEntity({
          id: null,
          userId: testUserEntity.id,
          courseId: courseId,
          role: Roles.Student,
        });

        const upsertEnrollmentEntityResult =
          enrollmentRepository.upsert(testEnrollmentEntity);

        // 測試是否能 withdraw user by enrollementId
        const withdrawUserByEnrollmentIdResult =
          enrollmentService.withdrawUserByEnrollmentId(
            upsertEnrollmentEntityResult.id,
          );

        expect(withdrawUserByEnrollmentIdResult).toStrictEqual(
          testEnrollmentEntity,
        );
      });

      it('should throw BadRequestException when enrollment is not found', () => {
        const enrollmentId = 1; // The enrollment does not exits.
        const withdrawUserByEnrollmentIdCall = () =>
          enrollmentService.withdrawUserByEnrollmentId(enrollmentId);

        expect(withdrawUserByEnrollmentIdCall).toThrow(BadRequestException);
        expect(withdrawUserByEnrollmentIdCall).toThrow('Enrollment not found.');
      });
    });

    describe('getEnrollmentByEnrollmentId', () => {
      it('should return an enrollment with a valid enrollmentId', () => {
        // 建立測試資料
        const testUser = new UserEntity({
          id: null,
          name: 'Test User',
          email: 'a@f',
        });
        const testUserEntity = userRepository.save(testUser);
        const courseId = 2; // The course exist.
        const testEnrollment = new EnrollmentEntity({
          id: null,
          userId: testUserEntity.id,
          courseId: courseId,
          role: Roles.Student,
        });
        const testEnrollmentEntity =
          enrollmentRepository.upsert(testEnrollment);

        const getEnrollmentByEnrollmentIdResult =
          enrollmentService.getEnrollmentByEnrollmentId(
            testEnrollmentEntity.id,
          );

        expect(getEnrollmentByEnrollmentIdResult).toStrictEqual(
          testEnrollmentEntity,
        );
      });

      it('should return null when enrollment is not found', () => {
        const enrollmentId = 1; // The enrollment does not exist.
        const getEnrollmentByEnrollmentIdResult =
          enrollmentService.getEnrollmentByEnrollmentId(enrollmentId);

        expect(getEnrollmentByEnrollmentIdResult).toBeNull();
      });
    });

    describe('getEnrollmentsByMultiConditions', () => {
      it('should return enrollment entities based on courseId and userId', () => {
        // 建立測試資料，建立 EnrollmentEntity 並且存入 EnrollmentsRepository 來使用。
        const mockEnrollmentOne = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentTwo = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 789,
          role: Roles.Student,
        });
        const mockEnrollmentThree = new EnrollmentEntity({
          id: null,
          userId: 888,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentFour = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 456,
          role: Roles.Teacher,
        });
        enrollmentRepository.upsert(mockEnrollmentOne);
        enrollmentRepository.upsert(mockEnrollmentTwo);
        enrollmentRepository.upsert(mockEnrollmentThree);
        enrollmentRepository.upsert(mockEnrollmentFour);

        const expectedEnrollments = [mockEnrollmentOne, mockEnrollmentFour];

        const userId = 123;
        const courseId = 456;
        const getEnrollmentsByMultiConditionsResult =
          enrollmentService.getEnrollmentsByMultiConditions(
            userId,
            courseId,
            null,
          );

        expect(getEnrollmentsByMultiConditionsResult).toStrictEqual(
          expectedEnrollments,
        );
      });

      it('should return enrollment entities based on courseId, userId and role', () => {
        // 建立測試資料，建立 EnrollmentEntity 並且存入 EnrollmentsRepository 來使用。
        const mockEnrollmentOne = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentTwo = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 789,
          role: Roles.Student,
        });
        const mockEnrollmentThree = new EnrollmentEntity({
          id: null,
          userId: 888,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentFour = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 741,
          role: Roles.Teacher,
        });

        enrollmentRepository.upsert(mockEnrollmentOne);
        enrollmentRepository.upsert(mockEnrollmentTwo);
        enrollmentRepository.upsert(mockEnrollmentThree);
        enrollmentRepository.upsert(mockEnrollmentFour);
        const expectedEnrollments = [mockEnrollmentOne];

        const userId = 123;
        const courseId = 456;
        const role = Roles.Student;
        const getEnrollmentsByMultiConditionsResult =
          enrollmentService.getEnrollmentsByMultiConditions(
            userId,
            courseId,
            role,
          );

        expect(getEnrollmentsByMultiConditionsResult).toStrictEqual(
          expectedEnrollments,
        );
      });

      it('should return enrollment entities based on courseId and role', () => {
        // 建立測試資料，建立 EnrollmentEntity 並且存入 EnrollmentsRepository 來使用。
        const mockEnrollmentOne = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentTwo = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 789,
          role: Roles.Student,
        });
        const mockEnrollmentThree = new EnrollmentEntity({
          id: null,
          userId: 888,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentFour = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 741,
          role: Roles.Teacher,
        });

        enrollmentRepository.upsert(mockEnrollmentOne);
        enrollmentRepository.upsert(mockEnrollmentTwo);
        enrollmentRepository.upsert(mockEnrollmentThree);
        enrollmentRepository.upsert(mockEnrollmentFour);

        const expectedEnrollments = [mockEnrollmentOne, mockEnrollmentThree];

        const courseId = 456;
        const role = Roles.Student;
        const getEnrollmentsByMultiConditionsResult =
          enrollmentService.getEnrollmentsByMultiConditions(
            null,
            courseId,
            role,
          );

        expect(getEnrollmentsByMultiConditionsResult).toStrictEqual(
          expectedEnrollments,
        );
      });

      it('should return enrollment entities based on userId and role', () => {
        // 建立測試資料，建立 EnrollmentEntity 並且存入 EnrollmentsRepository 來使用。
        const mockEnrollmentOne = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 456,
          role: Roles.Student,
        });
        const mockEnrollmentTwo = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 789,
          role: Roles.Student,
        });
        const mockEnrollmentThree = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 753,
          role: Roles.Student,
        });
        const mockEnrollmentFour = new EnrollmentEntity({
          id: null,
          userId: 123,
          courseId: 741,
          role: Roles.Teacher,
        });

        enrollmentRepository.upsert(mockEnrollmentOne);
        enrollmentRepository.upsert(mockEnrollmentTwo);
        enrollmentRepository.upsert(mockEnrollmentThree);
        enrollmentRepository.upsert(mockEnrollmentFour);

        const expectedEnrollments = [
          mockEnrollmentOne,
          mockEnrollmentTwo,
          mockEnrollmentThree,
        ];

        const userId = 123;
        const role = Roles.Student;
        const getEnrollmentsByMultiConditionsResult =
          enrollmentService.getEnrollmentsByMultiConditions(userId, null, role);

        expect(getEnrollmentsByMultiConditionsResult).toStrictEqual(
          expectedEnrollments,
        );
      });

      it('should return an empty array when no matching enrollment entities found', () => {
        const result = enrollmentService.getEnrollmentsByMultiConditions(
          null,
          null,
          Roles.Teacher,
        );

        expect(result).toEqual([]);
      });
    });
  });
});
