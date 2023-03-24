import { FormBuilder, FormGroup } from '@angular/forms';

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
    variable: [
      blockData.variable ?? {
        name: 'name',
        type: 1,
        validators: {
          regex: '',
          min: '',
          max: '',
          validationMessage: '',
        },
      },
    ],
    position: [blockData.position ?? { x: 200, y: 50 }],
  });
}
