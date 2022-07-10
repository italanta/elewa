import { Injectable } from "@angular/core";

/**
 * Service that helps with transclusion of elements.
 */
@Injectable({ providedIn: 'root' })
export class TransclusionHelper {

  constructor() {}

  // src - https://github.com/angular/angular/issues/12530

  /**
   * Can check if a transclusable element is empty.
   * Call function on parent element of the transclusable cell.
   */
  public trcElIsEmpty(el: HTMLElement)       // Static method, but injected in root so whole class is singleton anyway
  {
    const nodes = el.childNodes;

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes.item(i);
        if (node.nodeType !== 8 && nodes.item(i).textContent?.trim().length !== 0) {
            return false;
        }
    }

    return true;
  }

}
