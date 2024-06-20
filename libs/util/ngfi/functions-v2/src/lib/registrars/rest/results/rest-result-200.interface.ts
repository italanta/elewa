import { RestResult } from "./rest-result.interface";

export interface RestResult200 extends RestResult {
  success: true;
}