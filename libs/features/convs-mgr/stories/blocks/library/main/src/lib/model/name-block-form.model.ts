import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { NameMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 *
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateNameMessageBlockForm(
  _fb: FormBuilder,
  blockData: NameMessageBlock
): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    message: [blockData?.message! ?? ''],
    type: [blockData.type ?? StoryBlockTypes.Name],
    position: [blockData.position ?? { x: 200, y: 50 }],

    // variables FormGroup
    variable: _fb.group({
      name: [blockData.variable?.name ?? '', [Validators.required]],
      type: [blockData.variable?.type ?? 1, [Validators.required]],
      validate: [blockData.variable?.validate ?? false, [Validators.required]],

      // validators FormGroup
      validators: _fb.group({
        regex: [blockData.variable?.validators?.regex ?? ''],
        min: [blockData.variable?.validators?.min ?? ''],
        max: [blockData.variable?.validators?.max ?? ''],
        validationMessage: [
          blockData.variable?.validators?.validationMessage ??
            "I'm afraid I didn't understand, could you try again, please?",
        ],
      }),
    }),
  });
}
