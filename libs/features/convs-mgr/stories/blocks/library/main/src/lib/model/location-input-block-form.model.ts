import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { LocationInputBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateLocationInputBlockForm(_fb: FormBuilder, blockData: LocationInputBlock): FormGroup 
{
  return _fb.group({
    id: [blockData?.id! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    message: [blockData?.message! ?? ''],
    type: [blockData.type ?? StoryBlockTypes.LocationInputBlock],
    position: [blockData.position ?? { x: 200, y: 50 }],

    variables: _fb.group({
      name: [blockData.variable?.name ?? '', [Validators.required]],
      type: [blockData.variable?.type ?? 1, [Validators.required]],
      validate: [blockData.variable?.validate ?? false, [Validators.required]],

      validators: _fb.group({
        regex: [blockData.variable?.validators?.regex ?? ''],
        validationMessage: [
          blockData.variable?.validators?.validationMessage ??
            "I'm afraid I didn't get that, could you send your pin again, please?",
        ],
      })
    })
  })
}