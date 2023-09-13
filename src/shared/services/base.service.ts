import { BaseEntity } from '../entities/base.entity';
import { Repository } from 'typeorm';

export class BaseService<Entity extends BaseEntity> {
  constructor(private repository: Repository<Entity>) {}

  findById(id: any): Promise<Entity> {
    return this.repository.findOneBy({ id });
  }

  findOne(conditions: any): Promise<Entity> {
    return this.repository.findOne({ where: conditions });
  }

  async update(id: any, data: any): Promise<void> {
    await this.repository.update({ id }, data);
  }
}
