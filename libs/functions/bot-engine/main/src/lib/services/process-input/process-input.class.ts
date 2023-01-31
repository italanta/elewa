import { HandlerTools } from "@iote/cqrs";

export class ProcessInput<T>
{
  protected variableName: string;

  constructor(private _tools: HandlerTools) { }

  protected async saveInput(orgId: string, endUserId: string, inputValue: T): Promise<boolean>
  {
    try {
      // Create the path to save the document
      const docPath = `orgs/${orgId}/end-users/${endUserId}/variables`;

      const valuesRepo$ = this._tools.getRepository<any>(docPath);

      // Get the already saved data, if any
      const savedVariableValues = await valuesRepo$.getDocumentById(`values`);

      // If no data has been saved, we go ahead and create the document
      if (!savedVariableValues) {
        const values = {
          [this.variableName]: inputValue
        };

        return valuesRepo$.create(values, 'values');
      } else {
        // If the variable tagged already has a value, we create an array and push the new value
        if (savedVariableValues[this.variableName]) {
          const existingValues = savedVariableValues[this.variableName];

          const valueArray = [...existingValues];

          valueArray.push(inputValue);

          savedVariableValues[this.variableName] = valueArray;

        } else {
          savedVariableValues[this.variableName] = inputValue;
        }

        await valuesRepo$.update(savedVariableValues);
      }
      return true;

    } catch (error) {
      return false;
    }
  }
}