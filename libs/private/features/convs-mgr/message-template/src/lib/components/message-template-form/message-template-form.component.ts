import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private messageTemplatesService: MessageTemplatesService
  ) {}

  ngOnInit() {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      category: ['UTILITY'], // Set a default category or modify as needed
      language: ['', Validators.required],
      content: this.fb.group({
        header: [''],
        body: ['', Validators.required],
        footer: [''],
      }),
      buttons: this.fb.array([]), // Initialize an empty array for buttons
    });

    this.template = this.templateForm.value;
  }

  addButton() {
    // const buttons = this.templateForm.get('buttons') as FormArray;
    // buttons.push(
    //   this.fb.group({
    //     text: [''],
    //     type: ['PhoneNumber'],
    //     phoneNumber: [''],
    //     url: [''],
    //   })
    // );
  }
  
  cancel() {
    console.log('canceling');
  }
  save() {
    console.log('saving');
  }
}
