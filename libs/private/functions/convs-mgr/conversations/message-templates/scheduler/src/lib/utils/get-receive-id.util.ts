import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

export function getReceipientID(user: EnrolledEndUser, platform: PlatformType) {
  if(platform === PlatformType.WhatsApp) {
    return user.phoneNumber;
  } else if (platform === PlatformType.Messenger) {
    return user.receipientId;
  }
}