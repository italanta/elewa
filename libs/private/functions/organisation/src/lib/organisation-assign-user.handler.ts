import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { Organisation } from '@app/model/organisation';
import { iTalUser } from '@app/model/user';

export class OrganisationAssignUserHandler extends FunctionHandler<Organisation, boolean>
{

  public async execute(org: Organisation, context: FunctionContext, tools: HandlerTools) {

    const orgsRepo = tools.getRepository<any>(`orgs`);
    const userRepo = tools.getRepository<any>(`users`);

    const perRepo = tools.getRepository<any>(`orgs/${org.id}/config`);

    if (!!org.createdBy) {
      try {
        const activeOrg = {
          id: org.id,
          logoUrl: '',
          name: org.name,
          users: [org.createdBy],
          address: org.address,
          roles: ['admin', 'junior', 'senior', 'intern'],
          permissions: {}
        } as Organisation;

        orgsRepo.update(activeOrg);

        perRepo.write(this._defaultPermissions(), 'permissions');

        let adminUser: iTalUser = await userRepo.getDocumentById(org.createdBy);
        let adminRight = {
          admin: true,
          junior: false,
          senior: false,
          intern: false
        };

        adminUser.roles[org.id!] = adminRight;
        adminUser.activeOrg = org.id!;

        if (!adminUser.orgs) {
          adminUser.orgs = [];
        }
        
        adminUser.orgs.push(org.id!);

        userRepo.write(adminUser, org.createdBy)

        return true;

      } catch (err) {
        tools.Logger.log(() => `Error updating ${err}`)
        return false;
      }
    } else {
      return false
    }
  }

  private _defaultPermissions() {
    let defaultPermissions =  {
      GeneralSettings: {
        CanAddNewMember: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteMember: {admin:true, senior:false, junior:false, intern:false},
        CanEditMember: {admin:true, senior:false, junior:false, intern:false},
      },
      CompanySettings: {
        CanViewCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanCreateCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanEditCompanies: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteCompanies: {admin:true, senior:false, junior:false, intern:false},
      },
      LearnerSettings: {
        CanViewLearners: {admin:true, senior:false, junior:false, intern:false},
        CanCreateLearners: {admin:true, senior:false, junior:false, intern:false},
        CanEditLearners: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteLearners: {admin:true, senior:false, junior:false, intern:false},
      },
      AssessmentSettings: {
        CanViewAssessments: {admin:true, senior:false, junior:false, intern:false},
        CanCreateAssessments: {admin:true, senior:false, junior:false, intern:false},
        CanEditAssessments: {admin:true, senior:false, junior:false, intern:false},
        CanDeleteAssessments: {admin:true, senior:false, junior:false, intern:false},
      },
      ChatsSettings: {
        CanViewChats: {admin:true, senior:false, junior:false, intern:false},
        CanManageChats: {admin:true, senior:false, junior:false, intern:false},
      },
      AnalyticsSettings: {
        CanViewAnalytics: {admin:true, senior:false, junior:false, intern:false},
        CanManageAnalytics: {admin:true, senior:false, junior:false, intern:false},
      }
    }
    return defaultPermissions;
  }
}