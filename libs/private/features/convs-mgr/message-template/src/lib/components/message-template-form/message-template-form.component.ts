import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplateStore, MessageTemplatesService } from '@app/private/state/message-templates';

@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent implements OnInit{
  @ViewChild('textAreaElement') textAreaElement: ElementRef;
  
  templateForm: FormGroup;
  template: MessageTemplate;
  content: FormGroup;

  referenceForm: FormGroup;
  nextReferenceId: number;
  newVariables: string[] = [];

  constructor(
    private fb: FormBuilder,
    private messageTemplatesService: MessageTemplatesService,
    private messageTemplateStore: MessageTemplateStore,
    private _router: Router
  ) {}

  ngOnInit() {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      category: ['MARKETING'], // Set a default category or modify as needed
      language: ['en'],
      content: this.fb.group({
        header: [''],
        body: this.fb.group({
          text: ['', Validators.required],
          newVariable: ['',Validators.required],
          newPlaceholder: ['', Validators.required],
          examples: this.fb.array([]),
        }),
        footer: [''],
        templateId: [''],
        sent: [''],
      }),
      buttons: this.fb.array([]), // Initialize an empty array for buttons
    });
    // this.referenceForm = this.fb.group({
    //   newVariable: ['',Validators.required],
    //   newPlaceholder: ['', Validators.required],
    //   references: this.fb.array([]),
    // });
    // Subscribe to changes in the content.body control
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;
    const bodyControl = formBody.get('text') as FormControl;
    bodyControl.valueChanges.subscribe((updatedBody) => {
      this.updateReferencesFromBody(updatedBody);
    });

    this.template = this.templateForm.value;
  }

  addReference() {
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;

    const newVariable = formBody.get('newVariable')?.value;
    const newPlaceholder = formBody.get('newPlaceholder')?.value;
    const referencesArray = formBody.get('examples') as FormArray;
    
    const referenceId = this.nextReferenceId++;
  
    const referenceGroup = this.fb.group({
      id: referenceId,
      link: newPlaceholder,
      placeholder: newVariable,
    });
  
    referencesArray.push(referenceGroup);
  
    // Surround the newVariable with {{}} and append it to the current content.body
    const bodyControl = formBody.get('text') as FormControl;
    const updatedBody = `${bodyControl.value}{{${newVariable}}}`;
    bodyControl.setValue(updatedBody);
  
    // Track new variables
    this.newVariables.push(newVariable);
  
    // Clear the input fields
    formBody.get('newVariable')?.reset();
    formBody.get('newPlaceholder')?.reset();
  }
  

  removeReference(index: number) {
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;

    const referencesArray = formBody.get('examples') as FormArray;
    const bodyControl = formBody.get('text') as FormControl;
    const placeholder = referencesArray.at(index).get('placeholder')?.value;

    // Remove the reference from the body
    let updatedText = bodyControl.value;
    const referenceTag = `{{${placeholder}}}`;
    
    updatedText = updatedText.replace(new RegExp(referenceTag, 'g'), '');

    // Remove the new variable if it exists in the body
    const variableIndex = this.newVariables.indexOf(placeholder);
    if (variableIndex !== -1) {
      const newVariable = this.newVariables.splice(variableIndex, 1)[0];
      updatedText = updatedText.replace(newVariable, '');
    }

    bodyControl.setValue(updatedText);

    referencesArray.removeAt(index);
  }
  // Method to update references when body content changes
  updateReferencesFromBody(updatedBody: string) {
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;

    const referencesArray = formBody.get('examples') as FormArray;

    // Iterate over the references and check if their placeholders exist in the updatedBody
    for (let i = referencesArray.length - 1; i >= 0; i--) {
      const referenceGroup = referencesArray.at(i) as FormGroup;
      const placeholder = referenceGroup.get('placeholder')?.value;
      
      // If the placeholder does not exist in the updated body, remove the reference
      if (!updatedBody.includes(`{{${placeholder}}}`)) {
        referencesArray.removeAt(i);
        // Also remove the associated new variable
        const variableIndex = this.newVariables.indexOf(placeholder);
        if (variableIndex !== -1) {
          this.newVariables.splice(variableIndex, 1);
        }
      }
    }
  }
    
  cancel() {
    this._router.navigate(['/messaging'])
  }
  save() {
    console.log('saving',this.template);
    this.messageTemplateStore.createMessageTemplate(this.templateForm.value).subscribe((response) => {
      console.log('Template sent to firebase', response);
    })
    // this.messageTemplatesService.createTemplate(this.template).subscribe((response) => {
    //   // Handle the response, e.g., show a success message or navigate to a different page.
    //   console.log('Template created:', response);
    // });
  }

  
}
