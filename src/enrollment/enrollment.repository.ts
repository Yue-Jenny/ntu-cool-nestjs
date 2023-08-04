import { Injectable } from '@nestjs/common';
import { EnrollmentEntity } from '../entity/enrollment/enrollment.entity';

@Injectable()
export class EnrollmentsRepository {
  private enrollments: EnrollmentEntity[] = [];
  private enrollmentIdCounter = 0;

  /**
   *
   * @param newEnrollment
   * @returns EnrollmentEntity
   */
  public upsert(newEnrollment: EnrollmentEntity): EnrollmentEntity {
    // 先尋找此角色的 User 是否已有報名過此課程，若有，則回傳先前報名過的 enrollment 資料，若無，則將 enrollment 資料更新。
    const enrollment = this.enrollments.find(
      (enrollment) =>
        (!newEnrollment.userId || enrollment.userId === newEnrollment.userId) &&
        (!newEnrollment.courseId ||
          enrollment.courseId === newEnrollment.courseId) &&
        (!newEnrollment.role || enrollment.role === newEnrollment.role),
    );

    if (!enrollment) {
      this.enrollmentIdCounter++;
      newEnrollment.id = this.enrollmentIdCounter;
      this.enrollments.push(newEnrollment);
      return newEnrollment;
    } else {
      return enrollment;
    }
  }

  /**
   *
   * @param enrollmentId
   * @returns EnrollmentEntity
   */
  public withdrawUser(enrollmentId: number): EnrollmentEntity {
    const index = this.enrollments.findIndex(
      (enrollment) => enrollment.id === enrollmentId,
    );

    if (index !== -1) {
      const needToDeletedUser = this.enrollments[index];
      this.enrollments.splice(index, 1);
      return needToDeletedUser;
    } else {
      return null;
    }
  }

  /**
   *
   * @param enrollmentId
   * @returns EnrollmentEntity
   */
  public getEnrollmentByEnrollmentId(enrollmentId: number): EnrollmentEntity {
    // 因為 enrollmentId 是 unique，所以用 find 找出第一個(也是唯一一個)吻合的 enrollment 即可。
    const foundEnrollmentEntity = this.enrollments.find(
      (enrollment) => enrollment.id === enrollmentId,
    );
    // 若找不到對應的 enrollment 結果，則回傳 null。
    if (!foundEnrollmentEntity) {
      return null;
    }
    return foundEnrollmentEntity;
  }

  /**
   *
   * @param courseId
   * @returns EnrollmentEntity[]
   */
  public getEnrollmentsByCourseId(courseId: number): EnrollmentEntity[] {
    // 因為每堂課都可能有許多學員報名，所以依據課程來搜尋，可能會有多個 enrollment 結果。因此需要篩選出滿足特定條件的所有元素。
    return this.enrollments.filter(
      (enrollment) => !courseId || enrollment.courseId === courseId,
    );
  }

  /**
   *
   * @param userId
   * @returns EnrollmentEntity[]
   */
  public getEnrollmentsByUserId(userId: number): EnrollmentEntity[] {
    // 因為一個學員可能報名很多課程，因此依據學員來搜尋，可能會有多個 enrollment 結果。因此需要篩選出滿足特定條件的所有元素。
    return this.enrollments.filter(
      (enrollment) => !userId || enrollment.userId === userId,
    );
  }

  /**
   *
   * @param filters
   * @returns EnrollmentEntity[]
   */
  public getEnrollmentsByMultiConditions(
    filters: Partial<EnrollmentEntity>,
  ): EnrollmentEntity[] {
    return this.enrollments.filter((item) => {
      // 對於過濾器中的每個屬性，確認是否在物件中有對應值
      for (const key in filters) {
        if (item[key] === undefined || item[key] !== filters[key]) {
          return false;
        }
      }
      return true;
    });
  }
}
