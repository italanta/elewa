import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { cloneDeep as __cloneDeep } from 'lodash';
import { map, switchMap, tap } from 'rxjs';
import { SubSink } from 'subsink';

import {
  StoryBlockTypes,
  StoryBlockVariable,
} from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryStateService } from '@app/state/convs-mgr/stories';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { VariablesService } from '../../providers/variables.service';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.scss'],
})
export class VariableInputComponent implements OnInit, OnDestroy {
  
  validate: boolean;
  @Input() BlockFormGroup: FormGroup;
  @Input() noValidation: boolean;

  private _sub = new SubSink();

  parentModuleId:string;
  botId:string;
  storyId:string;
  blockId: string;
  blockType: StoryBlockTypes;
  variablesForm: FormGroup;
  validationForm: FormGroup;

  saveAnswersInVariable: boolean;
  showSuccess: boolean;
  showError: boolean;
  errorMessage: string;

  variablesTypesList = [
    { name: VariableTypes[1], value: 1 },
    { name: VariableTypes[2], value: 2 },
    { name: VariableTypes[3], value: 3 },
    { name: VariableTypes[4], value: 4 },
  ];

  nametype = StoryBlockTypes.Name;
  emailtype = StoryBlockTypes.Email;
  phonetype = StoryBlockTypes.PhoneNumber;
  locationtype = StoryBlockTypes.LocationInputBlock;
  OpenEndedQuestion = StoryBlockTypes.OpenEndedQuestion

  constructor(
    private _variablesSer: VariablesService, 
    private _storiesStateSer:StoryStateService,
    private _moduleServ:BotModulesStateService,
    private route:ActivatedRoute) {}

  ngOnInit(): void {
    const blockValues = this.BlockFormGroup.value;
    this.blockId = blockValues.id;
    this.blockType = blockValues.type;

    this.saveAnswersInVariable = blockValues.variable.name && blockValues.variable.name !== '';

    /**
     * * we create a copy of the formGroup so we can validate before setting the values on submit.
     * * using the blocksFormGroup creates a very rare race condition where two variables can exist with the same name (if the user is warned that the variable is alredy used but still doesn't change the value) this is why we clone.
     */
    this.variablesForm = __cloneDeep(this.BlockFormGroup);

    // Subscribe to route param changes to get the botId
   this.getBotId()
  }

  get name() {
    return this.variablesForm.get('variable.name');
  }

  /**
   * - Updates the BlockFormGroup with all the selected properties.
   * - If validate is false, the variable validators will be reset to null.
   */
  onSubmit() {
    // Patch variable values from the cloned variablesFrom to the BlocksFromGroup
    const id = this.blockId;
    const form = this.BlockFormGroup.get('variable') as FormGroup;
    const name = this.variablesForm.get('variable.name')?.value;
    const type = this.variablesForm.get('variable.type')?.value;

     // Create a StoryBlockVariable object
    const storyBlockVariable: StoryBlockVariable = {
      id, 
      botId: this.botId || '', 
      name: name || '',
      type: parseInt(type) || VariableTypes.String,
      validate: this.validate || false, // include the validate property
    };


    form.patchValue({ name, type: parseInt(type), validate: this.validate });

    // patch validators values to BlockFormGroup validators.
    const blockValidators = this.BlockFormGroup.get('variable.validators') as FormGroup;

    if (this.validate) {
      const regex = (this.variablesForm.get('variable.validators') as FormGroup).get('regex')?.value;
      const max = (this.variablesForm.get('variable.validators') as FormGroup).get('max')?.value;
      const min = (this.variablesForm.get('variable.validators') as FormGroup).get('min')?.value;
      const validationMessage = (this.variablesForm.get('variable.validators') as FormGroup).get('validationMessage')?.value;

      blockValidators.patchValue({ regex, max, min, validationMessage });
    } else {
      this.BlockFormGroup.get('variable.validators')?.reset();
    }

    this._variablesSer.blocksWithVars$.subscribe((blocks)=> {

          const isPresent = blocks.find(
          (block) =>
            block.variable?.name === name &&
            block.id !== this.blockId
        );

          if (isPresent) {
            this.errorMessage = "The variable already exists";
            this.showError = true;
            this.showSuccess = false;
          } else {
            this.showSuccess = true;
            this.showError = false;
            this.errorMessage = "";

            this._variablesSer.saveVariables(storyBlockVariable);
          }
    })

  }

  getBotId() {
    this._sub.sink = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.storyId = params.get('id') || '';
          return this._storiesStateSer.getStoryById(this.storyId);
        }),
        switchMap((data) => {
          const parentModule = data?.parentModule;
          this.parentModuleId = parentModule || '';
          return this._moduleServ.getBotModuleById(this.parentModuleId);
        })
      )
      .subscribe((data) => {
        const parentBot = data?.parentBot;
        // Set botId only if it's not already set
        this.botId =  parentBot || '';
      });
  }

  toggleSaveAnswers() {
    this.saveAnswersInVariable = !this.saveAnswersInVariable;
  }

  setValidation() {
    this.validate = !this.validate;
  }
  

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
