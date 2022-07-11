import { Logger } from './logger/logger.interface';

import { ConsoleProductionLogger } from './logger/console-production-logger.class';
import { ConsoleDebugLogger } from './logger/console-debug-logger.class';
import { Environment } from '../environment/environment.interface';

let _logger: any = null;

/**
 * @returns The logger for the current config and environment.
 */
export function getLogger(env: Environment): Logger
{
  // Since environment cannot change within instance of the app, we only initialise once.
  if (!_logger)
  {
    _logger = env.production ? new ConsoleProductionLogger()
                             : new ConsoleDebugLogger();
  }

  return _logger;
}
