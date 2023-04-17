import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Label, LabelsStore } from '../stores/labels.store';

@Injectable({
  providedIn: 'root'
})
export class LabelsStateService {

  constructor(private _labelsStore$$: LabelsStore) { }

  getLabels() : Observable<Label[]> {
    return this._labelsStore$$.get();
  }

  createLabel(label: Label) : Observable<Label> {
    return this._labelsStore$$.add(label);
  }

  updateLabel(label: Label) : Observable<Label> {
    return this._labelsStore$$.update(label);
  }
}
