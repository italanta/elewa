import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpMethods, HttpMethodTypes, Variable } from '@app/model/convs-mgr/stories/blocks/main';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-webhook-edit',
  templateUrl: './webhook-edit.component.html',
  styleUrls: ['./webhook-edit.component.scss'],
})
export class WebhookEditComponent implements OnInit {
  @Input() form: FormGroup
  @Input() title: string;
  
  httpCategories: HttpMethods[] = [
    { method: HttpMethodTypes.POST, name: 'POST' },
    { method: HttpMethodTypes.GET, name: 'GET' },
    { method: HttpMethodTypes.DELETE, name: 'DELETE' }
  ];

  variables = new FormControl();
  variables$: Observable<Variable[]>;

  ngOnInit() {
    console.log(this.form)
  }
}
