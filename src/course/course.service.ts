import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseEntity } from '../entity/course/course.entity';
import { UsersRepository } from '../user/users.repository';
import { EnrollmentsRepository } from '../enrollment/enrollment.repository';
import { CoursesRepository } from './courses.repository';

@Injectable()
export class CourseService {
  constructor(
    private userRepository: UsersRepository,
    private enrollmentRepository: EnrollmentsRepository,
    private courseRepository: CoursesRepository,
  ) {}

  /**
   * 7. everyone can get a course by course id;
   *  a. if the course doesn't exist, return Bad Request
   * @param courseId
   * @returns CourseEntity
   */
  getCourseById(courseId: number): CourseEntity {
    const course = this.courseRepository.getCourseById(courseId);
    // if the course doesn't exist, return Bad Request
    if (!course) {
      throw new BadRequestException();
    }
    const result = new CourseEntity({
      id: course.id,
      name: course.name,
    });
    return result;
  }

  /**
   * 8. everyone can query courses by user id ;
   *  a. if the user doesn't exist, return Bad Request
   * @param userId
   * @returns CourseEntity[]
   */
  getCoursesByUserId(userId: number): CourseEntity[] {
    // 調用 userRepository 取得 user by userId
    const user = this.userRepository.getUserById(userId);
    if (!user) {
      throw new BadRequestException();
    }

    // 調用 enrollmentRepository 取得 enrollments by userId
    const enrollments =
      this.enrollmentRepository.getEnrollmentsByUserId(userId);

    // 將 enrollments 中的 courseId 取出，並且包裝為 CourseEntity 回傳
    const courseEntities = [];
    enrollments.forEach((item) => {
      // 調用 courseRepository 取得 course
      const matchedCourse = this.courseRepository.getCourseById(item.courseId);

      const courseEntity = new CourseEntity({
        id: matchedCourse.id,
        name: matchedCourse.name,
      });

      courseEntities.push(courseEntity);
    });

    return courseEntities;
  }
}
