import { IAssessmentRepository } from '../../application/contracts';
import { Assessment as AssessmentType, CreateAssessmentDTO } from '../../types';
import { Assessment } from '../sequelize/models/Assessment';

export class AssessmentRepository implements IAssessmentRepository {
  public async create(assessmentData: CreateAssessmentDTO): Promise<AssessmentType> {
    const assessment = await Assessment.create(assessmentData);
    return assessment;
  }

  public async findAll(): Promise<AssessmentType[]> {
    return Assessment.findAll();
  }

  public async delete(id: number): Promise<boolean> {
    const count = await Assessment.destroy({ where: { id } });
    return count > 0;
  }
}
