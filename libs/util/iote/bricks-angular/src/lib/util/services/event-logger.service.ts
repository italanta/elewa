import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
/**
 * Wrapper around event logging middleware such as Google Analytics, ...
 */
@Injectable({ providedIn: 'root' })
export abstract class EventLogger
{
  constructor(protected _logger: Logger) {}

  abstract logEvent(name: string, data?: any, options?: any): void;
}
