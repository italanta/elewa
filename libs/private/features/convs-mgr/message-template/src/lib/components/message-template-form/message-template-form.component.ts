import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';

@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent implements OnInit{
  templateForm: FormGroup;
  template: MessageTemplate;
  content: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageTemplatesService: MessageTemplatesService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.content = this.fb.group({
      header: [''],
      body: ['', Validators.required],
      footer: [''],
    });

    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      category: ['UTILITY'], // Set a default category or modify as needed
      language: ['en', Validators.required],
      content: this.content,
      buttons: this.fb.array([]), // Initialize an empty array for buttons
    });

    this.template = this.templateForm.value;
  }
  
  cancel() {
    this._router.navigate(['/messaging'])
  }
  save() {
    console.log('saving', this.templateForm.value);
  }
}
