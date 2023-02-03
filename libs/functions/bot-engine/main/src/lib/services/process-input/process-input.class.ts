import { Variable, VariableTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools } from "@iote/cqrs";

export class ProcessInput<T>
{
  protected variableName: string;
  protected savedInputs: any;

  constructor(private _tools: HandlerTools) {}

  private async getSavedInputs(orgId: string, endUserId: string) 
  {
    // Create the path to save the document
    const docPath = `orgs/${orgId}/end-users/${endUserId}/variables`;

    const valuesRepo$ = this._tools.getRepository<any>(docPath);

    // Get the already saved data, if any
    this.savedInputs = await valuesRepo$.getDocumentById(`values`);
  }

  async saveInput(orgId: string, endUserId: string, inputValue: T, type?: VariableTypes): Promise<boolean>
  {
    const variableType = type ? type : VariableTypes.String;

    await this.getSavedInputs(orgId, endUserId);

    try {
      // Create the path to save the document
      const docPath = `orgs/${orgId}/end-users/${endUserId}/variables`;

      const valuesRepo$ = this._tools.getRepository<any>(docPath);

      // If no data has been saved, we go ahead and create the document
      if (!this.savedInputs) {
        const updatedInputs = this.__updateInputs(this.savedInputs, inputValue, variableType);

        return valuesRepo$.create(updatedInputs, 'values');
      } else {
        // If the variable tagged already has a value, we create an array and push the new value
        const updatedInputs = this.__updateInputs(this.savedInputs, inputValue, variableType);

        await valuesRepo$.update(updatedInputs);
      }
      return true;

    } catch (error) {
      return false;
    }
  }

  private __updateInputs(savedInputs: any, value: T, variableType: VariableTypes ) {
    const updatedInputs = savedInputs || {};

    switch (variableType) {
      case VariableTypes.Array:
        if(!updatedInputs[this.variableName]) {
          updatedInputs[this.variableName] = [value];
        } else {
          updatedInputs[this.variableName].push(value);
        }

        break;
      default:
        updatedInputs[this.variableName] = value;
        break;
    }
    return updatedInputs;
}
}