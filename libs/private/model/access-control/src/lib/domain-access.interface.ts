import { AccessRights } from './access-rights.emun';
import { AppClaimDomains } from './app-claim-domains.enum';


export interface DomainAccess
{
  name: AppClaimDomains;
  access: AccessRights
}