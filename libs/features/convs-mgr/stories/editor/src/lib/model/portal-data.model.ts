import { FormGroup } from "@angular/forms";

/** Model which defines the schema for the data sent through the portal */
export interface PortalData {
  form: FormGroup
  title: string
}
