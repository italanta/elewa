import { TemplateCategoryTypes, TemplateStatusTypes } from "@app/model/convs-mgr/functions";

/**
 * The response that will be sent back by the template API
 */
export interface ManageTemplateResponse
{
  /** Status of the response from the Meta servers */
  success: boolean;
  /** Provides more information about this response */
  message?: string;
  data?: {
    /** Id of the template provided by Meta */
    id: string;

    /** Name of the template that was provided for creation */
    name: string;

    /** The review status of the template */
    status: TemplateStatusTypes;

    /** The category the template belongs to */
    category?: TemplateCategoryTypes;
  };
}