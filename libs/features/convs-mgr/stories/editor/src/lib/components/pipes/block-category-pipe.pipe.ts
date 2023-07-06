import { Pipe, PipeTransform } from '@angular/core';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

@Pipe({
  name: 'blockCategoryPipe'
})
export class BlockCategoryPipe implements PipeTransform {

  transform(blocks: StoryBlock[], category: string): StoryBlock[] {
    const groupedBlocks = blocks.filter((block: StoryBlock) => {
      return block.blockCategory === category;
    });

    return groupedBlocks
  }
}
