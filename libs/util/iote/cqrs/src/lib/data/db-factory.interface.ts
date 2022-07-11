import { IObject } from '@iote/bricks';
import { Repository } from './repositories/repository.interface';

export interface DbFactory
{
  create<T extends IObject>(collection: string): Repository<T>;
}
