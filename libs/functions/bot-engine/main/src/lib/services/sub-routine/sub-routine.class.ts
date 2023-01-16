import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { Stack } from '@app/model/convs-mgr/functions';

/**
 * @see Cursor.subRoutines - A subroutine is a conversational flow within another story. 
 * 
 * The SubRoutineManager is responsible for the creation and updating of these subroutines. It also
 *  enables movement back to the previus subroutine when a subroutine is finished.
 * 
 * Because we can have a subroutine inside a subroutine, we use an array to save the muliple subroutines. 
 *  Whereby the first index is the current subroutine being run. The array follows the stack concept we use 
 *    an array so that we can be able to go back to the previous subroutine without deleting any items.
 * @example
 * [Subroutine4, Subroutine3, Subroutine2, Subroutine1]
 */
export class SubRoutineManager 
{
  private subRoutineArray: Stack<Cursor>[];

  constructor(subRoutineArray: Stack<Cursor>[])
  {
    if(!subRoutineArray) {
      this.subRoutineArray = [];
    }
    this.subRoutineArray = subRoutineArray;
  }

  /**
   * Plays through the subroutines. It can either create a new subroutine or
   *  update the current one.
   * 
   * @param newCursor - The new cursor that marks the end user position in the subroutine.
   * @param currentCursor - The current cursor firestore document that marks the end user
   *     position in the root story.
   */
  run(newCursor: Cursor, currentCursor: Cursor)
  {
    if (!currentCursor.subRoutines) {

      return this.newSubRoutineArray(newCursor);
      
    } else {

      return this.updateSubroutine(newCursor, currentCursor.storyDepth);
    }
  }

  /**
   * When the end user is interacting with our chatbot, we need to know their current position
   *  in the subroutine so that we can calculate the next block
   * 
   * We therefore use @type {Cursor} to save the block sent to the user and mark the current position 
   * 
   * @see Cursor.subRoutines
   */
  getLatestCursor(currentCursorDepth: number)
  {
    // Get the index of where the current subroutine is stored.
    //  When going forward between subroutines the index is always 0. e.g. this.subRoutineArray[0],
    //    But we make it dynamic so that the same function can be used when going backwards.
    //
    // The currentCursorDepth will always be the same as the length of the subroutines array,
    //  Unless we are going backwards, in that case it will be less and we will get index 1, 2, 3 and so on.
    const currentRoutineIndex = this.subRoutineArray.length - currentCursorDepth;

    const currentRoutine = this.subRoutineArray[currentRoutineIndex];

    // We then return the cursor at the top of our stack
    return currentRoutine.peek();
  }
  /**
   * In the case whereby the bot engine is triggered to a subroutine (storyDepth + 1)
   *   we will create a new Subroutine with the Cursor provided and add it to the subRoutineArray
   */
  private newSubRoutineArray(cursor: Cursor)
  {
    // Create a stack with the new cursor
    const newSubRoutine = new Stack<Cursor>(cursor);

    // Add the new subroutine to the start of the subroutine array
    this.subRoutineArray.unshift(newSubRoutine);

    return this.subRoutineArray;
  }

  /**
   * Updates the user position in a subroutine and returns the new subroutine array.
   * 
   * @param cursor - The new cursor that marks the end user position in the subroutine.
   * @param currentCursorDepth - The depth of the current cursor document of the root story.
   * 
   * @returns subRoutineArray
   */
  private updateSubroutine(cursor: Cursor, currentCursorDepth: number)
  {
    const NEW_CURSOR_DEPTH = cursor.storyDepth;

    // Get the index of the current subroutine from the subRoutineArray
    const currentRoutineIndex = this.getCurrentRoutineIndex(NEW_CURSOR_DEPTH, currentCursorDepth);

    // If the depth of the new cursor has increased compared to the old one, then that means 
    //   we have another subroutine inside the current one.
    // So we create a new Stack with the cursor provided and add it to the start of the subRoutineArray
    if (NEW_CURSOR_DEPTH > currentCursorDepth) {

      const newRoutine = new Stack(cursor);

      this.subRoutineArray.unshift(newRoutine);

    } else {
      // In this case, the current subroutine is still active. So we get it and
      //  push the new cursor to the top of the Stack.
      const currentRoutine = this.subRoutineArray[currentRoutineIndex];

      currentRoutine.push(cursor);

      // Update the changed subroutine in the subRoutineArray
      this.subRoutineArray[currentRoutineIndex] = currentRoutine;
    }

    return this.subRoutineArray;
  }
  /**
   * Gets the array index of where the current subroutine is stored.
   * 
   * When going forward between subroutines the index is always 0. e.g. this.subRoutineArray[0],
   *    But we make it dynamic so that the same function can be used when going backwards.
   *
   * The currentCursorDepth will always be the same as the length of the subroutines array,
   *  Unless we are going backwards, in that case it will be less and we will get index 1, 2, 3 and so on.
   */
  private getCurrentRoutineIndex(newCursorDepth: number, currentCursorDepth: number)
  {

    // If the newCursor has a lower depth that the current cursor, 
    //  it means that a subroutine finished and we are moving to the previous one
    if (newCursorDepth < currentCursorDepth) {

      return this.subRoutineArray.length - newCursorDepth;
    }
    return currentCursorDepth - this.subRoutineArray.length;
  }

}