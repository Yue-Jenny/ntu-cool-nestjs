import { Controller } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('/api/v1/enrollment')
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  // 2. everyone can enroll a user to a course by user id, course id and role;
  //  a. if the user, the course or the role doesn't exist, return Bad Request
  // 3. everyone can withdraw a user by enrollment id;
  //  a. if the enrollment doesn't exist, return Bad Request
  // 4. everyone can get an enrollment by enrollment id;
  // 5. everyone can query enrollments in the course by course id, and filter by role or user id;
  //  a. use a query string to specify a role or user id. like: ``/?userId=1&role=student``
  //  b. if the course doesn't exist, return Bad Request
  // 6. everyone can query enrollments by user id, and filter by role or course id;
  //  a. use a query string to specify a role or course id. like: ``/?role=student``
  //  b. if the user doesn't exist, return Bad Request
}
