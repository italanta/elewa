import { IObject } from "@iote/bricks";

import { Logger } from "../util/logger/logger.interface";
import { Repository } from "../data/repositories/repository.interface";

export interface HandlerTools
{
  Logger: Logger;
  getRepository: <T extends IObject>(documentPath: string) => Repository<T>;
}
