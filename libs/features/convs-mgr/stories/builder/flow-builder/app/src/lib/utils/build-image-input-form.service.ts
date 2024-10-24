import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { FlowImage } from "@app/model/convs-mgr/stories/flows";

@Injectable({providedIn: 'root'})
export class ImageInputFormService
{
  constructor( private _fb: FormBuilder){}

  buildImageForm(element?: FlowImage)
  {
    return this._fb.group({
      'alt-text': [element?.['alt-text'] || ''],
      src: [element?.src || ''],
      width: [element?.width || null],
      height: [element?.height || null],
      'scale-type': [element?.['scale-type'] || 'contain'],
      'aspect-ration': [element?.['aspect-ration'] || 1],
      type: [element?.type || 'image']
    });
  }
}
