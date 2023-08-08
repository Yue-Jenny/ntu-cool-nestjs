import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseController } from './course/course.controller';
import { CourseService } from './course/course.service';
import { EnrollmentService } from './enrollment/enrollment.service';
import { EnrollmentController } from './enrollment/enrollment.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UsersRepository } from './user/users.repository';
import { EnrollmentsRepository } from './enrollment/enrollment.repository';
import { CoursesRepository } from './course/courses.repository';

@Module({
  imports: [],
  controllers: [
    AppController,
    CourseController,
    EnrollmentController,
    UserController,
  ],
  providers: [
    AppService,
    CourseService,
    EnrollmentService,
    UserService,
    UsersRepository,
    EnrollmentsRepository,
    CoursesRepository,
  ],
})
export class AppModule {}
