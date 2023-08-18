import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { from, switchMap } from 'rxjs';

import { UserStore } from '@app/state/user';

import { FileStorageService } from './file-storage.service';

@Injectable({
  providedIn: 'root',
})

export class CMI5BlockService {
  constructor(
    private _aFF: AngularFireFunctions,
    private authService: UserStore,
    private fileStorageService: FileStorageService,
    private dialog: MatDialog
  ) {}



 
}
