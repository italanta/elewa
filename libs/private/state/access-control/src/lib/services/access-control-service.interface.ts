import { Observable } from 'rxjs';

import { AccessRights, AppClaimDomains } from '@app/private/model/access-control';

/**
 * Access Control Service
 *
 * Acts as the middleware which determines what claims receive what access.
 * Dependency injector pattern
 */
export interface IAccessControlService
{
  getRights(claim: AppClaimDomains) : Observable<AccessRights>;
}