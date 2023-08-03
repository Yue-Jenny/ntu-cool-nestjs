import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentEntity } from '../entity/enrollment/enrollment.entity';
import { EnrollmentsRepository } from './enrollment.repository';
import { UsersRepository } from '../user/users.repository';
import { CoursesRepository } from '../course/courses.repository';
import { CourseEntity } from 'src/entity/course/course.entity';
import { UserEntity } from 'src/entity/user/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    private userRepository: UsersRepository,
    private courseRepository: CoursesRepository,
    private enrollmentRepository: EnrollmentsRepository,
  ) {}

  /**
   * 2. everyone can enroll a user to a course by user id, course id and role;
   *  a. if the user, the course or the role doesn't exist, return Bad Request
   *  有多一個控制條件：此角色的 User 已有報名過此課程，不能重複報名。
   * @param userId
   * @param courseId
   * @param role
   * @returns EnrollmentEntity
   */
  enrollUser(userId: number, courseId: number, role: string): EnrollmentEntity {
    // if the user or the course doesn't exist, return Bad Request
    const course = this.courseRepository.getCourseById(courseId);
    const user = this.userRepository.getUserById(userId);

    if (!course || !user) {
      throw new BadRequestException('User or course not found.');
    }

    const enrollment = new EnrollmentEntity({
      id: null,
      userId: userId,
      courseId: courseId,
      role: role,
    });
    // 先尋找此角色的 User 是否已有報名過此課程，若有，則回傳先前報名過的 enrollment 資料，若無，則將 enrollment 資料更新。
    const enrollResults = this.enrollmentRepository.upsert(enrollment);
    return enrollResults;
  }

  /**
   *  3. everyone can withdraw a user by enrollment id;
   *    a. if the enrollment doesn't exist, return Bad Request
   * @param enrollmentId
   */
  withdrawUserByEnrollmentId(enrollmentId: number): EnrollmentEntity {
    const withdrawResult = this.enrollmentRepository.withdrawUser(enrollmentId);
    if (!withdrawResult) {
      throw new BadRequestException('Enrollment not found.');
    }
    return withdrawResult;
  }

  /**
   * 4. everyone can get an enrollment by enrollment id;
   * @param enrollmentId
   * @returns EnrollmentEntity
   */
  getEnrollmentByEnrollmentId(enrollmentId: number): EnrollmentEntity {
    const found =
      this.enrollmentRepository.getEnrollmentByEnrollmentId(enrollmentId);

    return found;
  }

  getCourseById(courseId: number): CourseEntity {
    // if the course doesn't exist, return Bad Request
    const course = this.courseRepository.getCourseById(courseId);
    if (!course) {
      throw new BadRequestException('Course not found.');
    }
    return course;
  }

  getUserById(userId: number): UserEntity {
    // if the user doesn't exist, return Bad Request
    const user = this.userRepository.getUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  /**
   * 5. everyone can query enrollments in the course by course id, and filter by role or user id;
   * 6. everyone can query enrollments by user id, and filter by role or course id;
   * @param userId
   * @param courseId
   * @param role
   * @returns EnrollmentEntity[]
   */
  getEnrollmentsByMultiConditions(
    userId: number,
    courseId: number,
    role: string,
  ): EnrollmentEntity[] {
    // 定義一個空 filter object
    const filters: Partial<EnrollmentEntity> = {};

    // 添加 key-value 資訊
    if (courseId) {
      filters['courseId'] = courseId;
    } else if (userId) {
      filters['userId'] = userId;
    } else if (role) {
      filters['role'] = role;
    }
    const foundEnrollmentEntities =
      this.enrollmentRepository.getEnrollmentsByMultiConditions(filters);

    return foundEnrollmentEntities;
  }
}
