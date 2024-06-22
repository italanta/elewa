import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, map } from 'rxjs';

import { StoryBlock, StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { VariablesStoreService } from '@app/state/convs-mgr/variables';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  /** list of blocks with variables already set */
  blocksWithVars$: Observable<StoryBlock[]>;
  private newVariablesSubject = new BehaviorSubject<any[]>([]);
  private newHeaderVariablesSubject = new BehaviorSubject<any[]>([]);
  newVariables$ = this.newVariablesSubject.asObservable();
  newHeaderVariables$ = this.newHeaderVariablesSubject.asObservable();

  constructor(
    private _blockStore$$: StoryBlocksStore,
    private _variablesStoreService$:VariablesStoreService
    ) {
    this.blocksWithVars$ = this.getBlocksWithVars();
  }

  getBlocksWithVars() {
    return this._blockStore$$
    .get()
    .pipe(
      map((blocks) =>
        blocks.filter(
          (block) =>
          // ignore deleted blocks, end blocks and blocks with the variables as an empty string or undefined
            !block.deleted && block.type < 1000 && block.variable?.name !== '' && block.variable?.name != undefined
        )
      )
    );
  }

  getAllVariables() : Observable<string[]> {
    return this.blocksWithVars$.pipe(
      map((blocks) => blocks.map((block) => block.variable?.name) as string[])
    );
  }

  saveVariables(variables: StoryBlockVariable) {
    // Assuming you have a method in your variableBlocksStore to save variables
    const variableId = variables.id; // Assuming variables.id is a string
    this._variablesStoreService$.saveVariables(variables, variableId);
  }

  getVariablesByBot(botId:string, orgId:string) : Observable<StoryBlockVariable[]>{
    return this._variablesStoreService$.getVariablesByBot(botId, orgId)
  }

  updateNewVariables(newVariables: any[]) {
    this.newVariablesSubject.next(newVariables);
    }
   
    updateHeaderVariables(newVariables: any[]) {
      this.newHeaderVariablesSubject.next(newVariables);
      }

    extractVariables = (text: string) => {
      const variableRegex = /\{\{([^}]+)\}\}/g;
      const matches = [];
      let match;
      while ((match = variableRegex.exec(text)) !== null) {
        matches.push(match[1]);
      }
      return matches;
    };

    filterObjectsByPlaceholder(list: any[], placeholders: string[]): any[] {
      return list.filter((item, index) => placeholders[index] === this.removeCharacters(item.placeholder));
    }

    removeCharacters(inputString: string): string {
      // Define a regular expression to match the characters you want to remove
      const regex = /[{}]/g; // Replace 'a', 'b', 'c', '1', '2', '3' with the characters you want to remove

      // Use the replace method to remove the matched characters
      const resultString = inputString.replace(regex, '');

      return resultString;
    }

}
