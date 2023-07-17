import { switchMap, take } from "rxjs";

import { Injectable } from "@angular/core";
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { UserStore } from '@app/state/user';

@Injectable({
	providedIn: 'root'
})

export class MetabaseService
{
	constructor(private _aFF: AngularFireFunctions,
		private authService: UserStore) { }

	getMetabaseLink()
	{
		return this.authService.getUser().pipe(
			take(1),
			switchMap(user => this._aFF.httpsCallable('getMetabaseUrl')(user)));
	}

}