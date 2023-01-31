import { HandlerTools } from "@iote/cqrs";

/**
 * For a better user experience and validation, we would need to respond back to the end user with
 *  their input. So, while creating blocks we can defined these variables in the in the format {{variable_name}}
 *  
 * With this we can then replace the message to be sent back to the user with the appropriate data
 * 
 * The name of the variable has to be the same as the property name of the variable in the object being passed.
 *    e.g. Considering the endUser object is { name: 'Reagan' }, to insert 'name' to an outgoing text, 
 *          we add the text to the block as 'Hello {{name}}'
 * 
 * TODO: Implement a way to fetch data from different data sources
 */
export class MailMergeVariables
{
  /** Regex to extract the variable between the {{}} curly braces */
  private _exp: RegExp = new RegExp('\{{(.*?)\}}');

  constructor(private _tools: HandlerTools) { }
  /**
   * For a better user experience and validation, we would need to respond back to the end user with
   *  their input. So, while creating blocks we can defined these variables in the in the format {{variable_name}}
   *  
   * With this we can then replace the message to be sent back to the user with the appropriate data
   * 
   * The name of the variable has to be the same as the property name of the variable in the object being passed.
   *    e.g. Considering the endUser object is { name: 'Reagan' }, to insert 'name' to an outgoing text, 
   *          we add the text to the block as 'Hello {{name}}'
   * 
   */
  async merge(outgoingText: string, orgId: string, endUserId: string): Promise<string>
  {
    this._tools.Logger.log(() => `[VariableInjectorService] - Checking message :: ${outgoingText}`);

    if(!this._exp.test(outgoingText)) return outgoingText;

    const savedVariableValues = await this.__getVariableValues(orgId, endUserId);

    const outgoingTextArray = outgoingText.split(" ");

    let newOutgoingText = outgoingText;

    for (const word of outgoingTextArray) {
      const variable = this.__getVariableFromText(word);

      if (variable) {
        this._tools.Logger.log(() => `[VariableInjectorService] - Replacing '${variable}' with '${savedVariableValues[variable as string]}`);

        newOutgoingText = newOutgoingText.replace(this._exp, savedVariableValues[variable]);
      }
    }

    return newOutgoingText;
  }

  /**
   * Extracts the variable from the text being sent to the end user
   * @param outgoingText - the text being sent to the end user
   * @returns variable 
   */
  private __getVariableFromText(outgoingText: string): string
  {
    // Extract the variable
    const variable = this._exp.exec(outgoingText);

    if (!variable) return null;

    return variable[1];
  }

  private async __getVariableValues(orgId: string, endUserId: string) 
  {
    const variableRepo = this._tools.getRepository<any>(`orgs/${orgId}/end-users/${endUserId}/variables`);

    const variableValues = await variableRepo.getDocumentById(`values`);

    return variableValues;
  }
}