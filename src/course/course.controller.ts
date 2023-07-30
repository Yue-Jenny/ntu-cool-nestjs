import { Controller } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('/api/v1/course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  // 1. everyone can query users in the course by course id;
  //  a. if the course doesn't exist, return Bad Request
  // 7. everyone can get a course by course id;
  //  a. if the course doesn't exist, return Bad Request
  // 8. everyone can query courses by user id ;
  //  a. if the user doesn't exist, return Bad Request
}
