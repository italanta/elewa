import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { HttpMethods, HttpMethodTypes, Variable } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-webhook-edit',
  templateUrl: './webhook-edit.component.html',
  styleUrls: ['./webhook-edit.component.scss'],
})
export class WebhookEditComponent {
  @Input() form: FormGroup
  @Input() title: string;
  
  httpCategories: HttpMethods[] = [
    { method: HttpMethodTypes.POST, name: 'POST', id: '1' },
    { method: HttpMethodTypes.GET, name: 'GET', id: '2' },
    { method: HttpMethodTypes.DELETE, name: 'DELETE', id: '3' }
  ];


  variables = new FormControl();
  variables$: Observable<Variable[]>;
}
