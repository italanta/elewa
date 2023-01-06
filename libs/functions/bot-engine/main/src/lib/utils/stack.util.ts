/**
 * A stack is an elementary data structure, that is often described as LIFO (last in first out). 
 *  An item that was added the last is the first to be retrieved.
 */
export class Stack
{
  items: any[];

  constructor(...params: any[])
  {
    this.items = [...params];
  }

  /** Appends new items onto the top of our stack */
  push(item: any) {
    this.items.unshift(item);
  }

  /** Return and remove the element at the top of the stack */
  pop() {
    return this.items.shift();
  }

  /** Return the element at the top of the stack without removing it. */
  peek() {
    return this.items[0];
  }

  /** Returns a boolean to see if a stack is empty or not */
  isEmpty() {
    return this.items.length == 0 ? true : false;
  }

  /** Returns all the items currently in the stack */
  getItems() {
    return this.items;
  }
}