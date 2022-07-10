import { Injectable, Inject } from '@angular/core';

import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';

const CONFIG_OBJ_NAME = 'app_config';

@Injectable({ providedIn: 'root' })
export class LocalPersistanceService
{
  constructor(@Inject(LOCAL_STORAGE) private _persistanceService: StorageService) { }

  getConfig(key: string) {
    const conf = this._persistanceService.get(CONFIG_OBJ_NAME);
    return conf && conf[key];
  }

  setConfig(key: string, value: any) {
    let conf = this._persistanceService.get(CONFIG_OBJ_NAME);
    if(!conf)
      conf = {};

    conf[key] = value;

    this._persistanceService.set(CONFIG_OBJ_NAME, conf);
    return true;
  }

  get(key: string) {
    return this._persistanceService.get(key);
  }

  put(key: string, value: any) {
    return this._persistanceService.set(key, value);
  }

  update(key: string, value: any) {
    return this._persistanceService.set(key, value);
  }

  delete(key: string) {
    return this._persistanceService.remove(key);
  }

}
