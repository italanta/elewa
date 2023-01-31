import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Variable } from '@app/model/convs-mgr/stories/blocks/main';

import { VariablesConfigStore } from '../stores/variables-config.store';

@Injectable({
  providedIn: 'root'
})
export class VariablesConfigService {

  constructor(private variables$: VariablesConfigStore) { }

  getAllVariables(): Observable<Variable[]> {
    return this.variables$.get();
  }
}