import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';

import { HandlerTools } from '@iote/cqrs';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';

import { genRandomPassword } from './utils/generatePassword.util';

export class CreateNewUserHandler extends FunctionHandler<any, void> {
  private _tools: HandlerTools;

  public async execute(userData: iTalUser, context: FunctionContext, tools: HandlerTools) {
    this._tools = tools;
    this._tools.Logger.debug(() => `Beginning Execution, Creating a new User`);

    return this.userExists(userData.email, userData);
  }

  private async userExists(email: string, userData: iTalUser) {
    const user = await admin.auth().getUserByEmail(email).then(async (user) => {
        this._tools.Logger.log(() => `Updating an existing user ${user.uid}`);

        this.addUserToOrg(userData.activeOrg, user.uid);

        const usersRepo = this._tools.getRepository<any>(`users`);
        const existingUser = await usersRepo.getDocumentById(user.uid);

        existingUser.roles[userData.activeOrg] = userData.roles[userData.activeOrg];
        existingUser.orgIds.push(userData.activeOrg);

        usersRepo.update(existingUser);
      })
      .catch(async () => {
        try {
          this._tools.Logger.log(() => `Creating a new user`);

          const password = genRandomPassword();

          await admin
            .auth()
            .createUser({
              email: userData.email,
              password: password,
              displayName: userData.displayName,
            })
            .then((user) => {
              this._updateUserDetails(
                user,
                password,
                userData
              );
            });
        } catch (e) {
          this._tools.Logger.log(() => `Did not create new user due to: ${e}`);
        }
      });
  }

  private async _updateUserDetails(user: UserRecord, password: string, userData: iTalUser) {
    try {
      this._tools.Logger.log(() => `Updating user data for ${user.uid}`);
      const usersRef = this._tools.getRepository<iTalUser>(`users`);

      const data: any = {}; // Actual Type: User

      if (user.email) data.email = user.email;
      if (user.photoURL) data.photoUrl = user.photoURL;
      if (user.phoneNumber) data.phoneNumber = user.phoneNumber;

      if (user.displayName) data.displayName = user.displayName || "Update Your Name";

      data.profile = userData.profile ? userData.profile : {};
      data.activeOrg = userData.activeOrg;
      data.orgIds = userData.orgIds;

      if (user.email) data.profile.email = user.email;

      data.roles = userData.roles ? userData.roles : { access: true, app: true };

      data.uid = user.uid;
      data.id = user.uid;

      data.createdOn = new Date();
      data.createdBy = 'AuthService';
      data.isNew = true;

      usersRef.create(data, user.uid);

      this.sendPasswordResetLink(user.email as string, userData.activeOrg, password);
      this.addUserToOrg(userData.activeOrg, user.uid);
    } catch (error) {
      this._tools.Logger.log(() => `Could not update user because ${error}`);
    }
  }

  private async addUserToOrg(orgId: string, userId: string) {
    try {
      this._tools.Logger.log(() => `Updating ${userId} on ${orgId}`);

      const orgsRepo = this._tools.getRepository<Organisation>(`orgs`);
      const org = await orgsRepo.getDocumentById(orgId);
      const orgUsers: string[] = org.users;

      orgUsers.push(userId);
      org.users = orgUsers;

      orgsRepo.update(org);
    } catch (error) {
      this._tools.Logger.log(() => `Could not update user on org due to ${error}`);
    }
  }

  private async sendPasswordResetLink(email: string, orgId: string, password: string) {
    try {
      await admin
        .auth()
        .generatePasswordResetLink(email)
        .then((link) => {
          this._tools.Logger.log(() => `Creating email template for password reset`);

          const mailRepo = this._tools.getRepository<any>(`orgs/${orgId}/mails`);
          const mail = {
            to: email,
            message: {
              subject: 'Reset your password',
              html: `<p> Use this link to reset your password <a href="${link}">Click here</a> <p>
                  <br>
                  Your Temporary password is: <b>${password}</b>`,
            },
          };

          mailRepo.create(mail);
        });
    } catch (error) {
      this._tools.Logger.log(() => `Could not send email due to ${error}`);
    }
  }
}
