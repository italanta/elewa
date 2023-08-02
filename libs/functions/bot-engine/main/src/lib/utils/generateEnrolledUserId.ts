import { randomUUID } from 'crypto'

/** 
 * Generate the enrolled user id in the.
*/
export function generateEnrolledUserId() {
  return randomUUID();
};
