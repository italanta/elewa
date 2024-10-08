import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';


import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl, FlowControlType, FlowImage } from '@app/model/convs-mgr/stories/flows';
import { FileStorageService } from '@app/state/file';
import { ImageInputFormService } from '../../utils/build-image-input-form.service';

@Component({
  selector: 'lib-image-type-input',
  templateUrl: './image-type-input.component.html',
  styleUrl: './image-type-input.component.scss',
})
export class ImageTypeInputComponent implements OnInit
{
  /** The type of input, for text inputs */
  type: FlowControlType;
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl;
  /**Image element */
  element: FlowImage;
  /** Dynamic input id */
  inputId = '';
  imageInputForm: FormGroup;
  /** View Container */
  vrc = inject(ViewContainerRef)
  /** Requored image file types */
  requiredFileType="image/png";
  /**Display mode */
  showForm = true;
  isUploading: boolean;

  fileAccept = 'image/jpeg, image/png';
  selectedFile: File;
  path: string;
  mediaSrc: File;
  uploadProgress = 0;

  private _sBS = new SubSink ();

  constructor(private trackerService: ChangeTrackerService,
              private _formService: ImageInputFormService,
              private _uploadService: FileStorageService,
) {}

  ngOnInit(): void
  {
    this.inputId = `input-${this.type}`;
    this.buildForms()
  }

  buildForms(element?: FlowImage): void {
    this.imageInputForm = element
      ? this._formService.buildImageForm(element)
      : this._formService.buildImageForm();
  }

  /** Upload a file once the user selects it */
  handleFileSelection(file: File): void 
  {
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type. Only JPEG and PNG files are allowed.');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.path = reader.result as string;
      this.mediaSrc = this.selectedFile;
      if (this.imageInputForm) {
        this.imageInputForm.patchValue({ src: this.mediaSrc });
      }

      this.uploadFile(this.selectedFile);
    };
  }
  /** Programmatically open the file explorer */
  openFileExplorer(accept: string): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept; // set the accepted file types
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileSelection(file);
      }
    });

    // Append to the body to trigger the click event
    document.body.appendChild(fileInput);
    fileInput.click();

    // Remove the input from the DOM after usage
    document.body.removeChild(fileInput);
  }

  /** Save selected file to Firebase */
  async uploadFile(file: File): Promise<void> 
  {
    this.isUploading = true;

    const mediaName = this.imageInputForm.controls['src'].value || this.selectedFile.name;

    const upload$ = await this._uploadService.uploadSingleFile(this.selectedFile, `flows/${mediaName}`);

    this._sBS.sink = upload$.subscribe(({downloadURL, filePath }) => {
        this.imageInputForm.patchValue({ src: downloadURL, mediaPath: filePath });
        this.isUploading = false;
    });
  }

  saveConfigurations()
  {
    if(this.imageInputForm.valid)
    {
      this.showForm = false
      const imageObject = this.imageInputForm.value
      this.element = imageObject
      this.triggerAutosave(imageObject)
    }
  }

  /** Trigger autosave */
  private triggerAutosave(newValue: any): void {
    this.trackerService.updateValue(newValue);
  }
}
