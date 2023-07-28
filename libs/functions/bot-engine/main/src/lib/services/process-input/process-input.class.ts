import { HandlerTools } from "@iote/cqrs";

import { StoryBlockVariable, VariableTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { MessageTypes } from "@app/model/convs-mgr/functions";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { ActiveChannel } from "../../model/active-channel.service";

export class ProcessInput<T>
{
  protected variableName: string;
  protected savedInputs: {[key:string]:any};

  constructor(private _tools: HandlerTools, private _activeChannel?: ActiveChannel) { }

  async saveInput(orgId: string, endUser: EndUser, inputValue: T, inputValueType: MessageTypes, type?: VariableTypes): Promise<boolean>
  {
    const variableType = type ? type : VariableTypes.String;

    this.savedInputs = endUser.variables;

    try {
      const endUserRepo$ = this._tools.getRepository<EndUser>(`orgs/${orgId}/end-users`);

      const updatedInputs = this.__updateInputs(this.savedInputs, inputValue, inputValueType, variableType);

      endUser.variables = updatedInputs;

      await endUserRepo$.update(endUser);

      return true;

    } catch (error) {

      this._tools.Logger.error(() => `Error saving input: ${error}`);

      return false;
    }
  }

  variableExists(storyBlockVariable: StoryBlockVariable)
  {
    return storyBlockVariable && storyBlockVariable.name !== "";
  }


  private __updateInputs(savedInputs: any, value: T, inputValueType: MessageTypes, variableType: VariableTypes)
  {
    const updatedInputs = savedInputs || {};

    // If the input is a question, we change the type to text
    if (inputValueType === MessageTypes.QUESTION) inputValueType = MessageTypes.TEXT;

    switch (variableType) {
      case VariableTypes.ArrayWithTypeAndValue:
        let variableObject = {};

        variableObject = {
          value: value,
          type: inputValueType
        };

        if (!updatedInputs[this.variableName]) {

          updatedInputs[this.variableName] = [variableObject];
        } else {
          updatedInputs[this.variableName].push(variableObject);
        }

        break;

      case VariableTypes.Array:
        if (!updatedInputs[this.variableName]) {

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