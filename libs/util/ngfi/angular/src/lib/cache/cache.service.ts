import { Injectable } from "@angular/core";

/**
 * Cache service that stores objects in localStorage or other means for later retrieve.
 */
@Injectable({ providedIn: 'root' })
export class CacheService {

  constructor() { }

  setValueForKey<T>(key: string, value: T, timeToLive?: number) {

    if(timeToLive)
      throw new Error('Cache TimeToLive Not yet implemented!');

    localStorage.setItem(key, JSON.stringify({ indefinite: !timeToLive, time: timeToLive, createdOn: Date.now(), value}));
  }

  getValueForKey<T>(key: string): T | false {
    const val = localStorage.getItem(key);

    if(val) {
      const parsed = JSON.parse(localStorage.getItem(key) as string);

      if(parsed.indefinite)
        return parsed.value;

      // else if(new Date(parsed.createdOn) + new Date(parsed.timeToLive) > Date.now()) {
    }

    return false;
  }
  
  getValueByKey<T>(key: string): T | false {
  /*Use this function to access the value of a key in localStorage.
    The function will return the value of the key if it exists else returns false.
  */
    const val = localStorage.getItem(key);

    if(val) {
      const parsed = JSON.parse(val);

      if(parsed)
        return parsed;
    }

    return false;
  }
}
