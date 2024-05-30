export function HasChanged(obj1: any, obj2: any): boolean {

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return true;

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];
      const areObjects = typeof value1 === 'object' && typeof value2 === 'object';

      if ((!areObjects && value1 !== value2) ||
          (areObjects && HasChanged(value1, value2))) {
        return true;
      }
    }
  }
  return false;
}