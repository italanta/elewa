import { Environment } from '@iote/cqrs';

export interface FrontendEnvironment extends Environment
{
  microAppUrl: string;
}