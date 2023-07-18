import * as jwt from 'jsonwebtoken';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';
import { User } from '@iote/bricks';

import { iTalUser } from '@app/model/user';

/** This handler is responsible for creating an authenticated jwt token
 * for the metabase ebedded iframe source.
 */

export class GetMetabaseUrlHandler extends FunctionHandler<User, string>
{
  public async execute(user: iTalUser, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Setting up metabase url for User: ${JSON.stringify(user.uid)}`);

    //TODO: Move to google secrets
    const METABASE_SITE_URL = "https://elewa-group.metabaseapp.com";
    const METABASE_SECRET_KEY = "f4b04fed137e7d78dd5f669ee4b2d03903097ecca37e1fe0d6870a161e2376ea";

    const displayname = user.displayName!.split(' ');

    //Define user's payload containing user's relevant details.
    const payload = {
      email: user.email,
      id: user.uid,
      org_id: user.activeOrg,
      first_name: displayname[0],
      last_name: displayname[1],
      groups: ["CLM"],
      exp: Math.round(Date.now() / 1000) + (525600 * 60 * 100), // 100 years expiration
    };

    //Sign the jwt with secret key provided by metabase.
    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    const iframeUrl = `${METABASE_SITE_URL}/auth/sso?jwt=${token}&return_to=${encodeURIComponent(METABASE_SITE_URL)}`;

    //save the iframe url for each user
    // const usersRepo = tools.getRepository<User>('users');

    // const userData = await usersRepo.getDocumentById(user.uid);

    // userData.profile.metabaseUrl = iframeUrl;

    // await usersRepo.write(userData,userData.uid)

    return iframeUrl;
  }
}