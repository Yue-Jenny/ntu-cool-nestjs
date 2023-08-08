import { Injectable } from '@nestjs/common';
import { CourseEntity } from 'src/entity/course/course.entity';

@Injectable()
export class CoursesRepository {
  private courses = [
    {
      id: 1,
      name: 'Software engineering 101',
    },
    {
      id: 2,
      name: '成為 Cool 大師的路上',
    },
    {
      id: 3,
      name: "You Don't Know Js",
    },
    {
      id: 4,
      name: "I Don't Know Js yet",
    },
  ];

  public getCourseById(courseId: number): CourseEntity {
    const foundCourseEntity = this.courses.find(
      (course) => course.id === courseId,
    );
    if (!foundCourseEntity) {
      return null;
    }
    return foundCourseEntity;
  }
}
