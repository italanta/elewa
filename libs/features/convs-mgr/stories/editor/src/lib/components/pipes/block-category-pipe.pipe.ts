import { Pipe, PipeTransform } from '@angular/core';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

@Pipe({
  name: 'blockCategoryPipe'
})
export class BlockCategoryPipe implements PipeTransform {

  transform(blocks: StoryBlock[], category: string, filter: string): boolean {
     const filteredBlocks = blocks.filter((block: StoryBlock) => {
      return block.blockCategory === category && block.message?.toString().toLowerCase().includes(filter);
     })
     return filteredBlocks.length > 0
  }  
}
