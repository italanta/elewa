import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';

import { variableBlocksStore } from '../stores/variable-blocks.store';


@Injectable({
  providedIn: 'root'
})
export class VariablesStoreService {

  constructor(
    private _variablesStore$$: variableBlocksStore
  ) { }

  // TODO:@JAPHETHNYARANGA You should use the other mutation methods provided by firebase (add, delete, update etc) to mutate your state (write should be a last resort)
  saveVariables(variables: StoryBlockVariable, id:string) {
    this._variablesStore$$.write(variables, id);
  }

  // TODO:@JAPHETHNYARANGA: delete this method and use the get method from the data store to fetch the variables, and then filter them by botID in your service
  getVariablesByBot(botId:string, orgId:string) : Observable<StoryBlockVariable[]>{
    return this._variablesStore$$.getBotVariables(botId, orgId)
  }
}
