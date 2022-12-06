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
export class VariableInjectorService 
{
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
  injectVariableToText(outgoingText: string, dataSource: any): string
  {
    const variable = this.__getVariableFromText(outgoingText);

    // Replace the variable with the information contained in the data source
    if (variable) {
      this._tools.Logger.log(() => `Replacing '${variable}' with '${dataSource[variable]}`);
      
      return outgoingText.replace(`{{${variable}}}`, dataSource[variable]);
    }
    return outgoingText;
  }

  /**
   * Extracts the variable from the text being sent to the end user
   * @param outgoingText - the text being sent to the end user
   * @returns variable 
   */
  private __getVariableFromText(outgoingText: string): string
  {
    // Regex to extract the variable between the {{}} curly braces
    const varRegex = new RegExp('\{{(.*?)\}}');

    // Extract the variable
    const variable = varRegex.exec(outgoingText);

    return variable[1];
  }
}