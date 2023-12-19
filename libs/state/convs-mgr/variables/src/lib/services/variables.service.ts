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


  saveVariablesToStore(variables: StoryBlockVariable, id:string) {
    
    this._variablesStore$$.write(variables, id);
  }

  getVariablesByBotInStore(botId:string, orgId:string) : Observable<StoryBlockVariable[]>{
    return this._variablesStore$$.getBotVariables(botId, orgId)
  }
}
