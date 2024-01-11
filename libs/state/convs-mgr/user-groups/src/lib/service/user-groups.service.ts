import { Injectable } from "@angular/core";
import { userGroups } from '@app/model/convs-mgr/user-groups';



import { userGroupsStore } from "../store/user-groups.store";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root',
})

export class userGroupsService{
    constructor(private _userGroups$$:userGroupsStore){}


    getAllUserGroups(): Observable<userGroups[]>{
        return this._userGroups$$.get();
    }

    addUserGroups(userGroup: userGroups):Observable<void>{
        return this._userGroups$$.add(userGroup);
    }

    getSpecifieduserGroups(id: string): Observable<userGroups>{
        return this._userGroups$$.getOne(id);
    }

    deleteUserGroup(id:string):Observable<void>{
        return this._userGroups$$.remove(id);
    }

    updateUserGroups(userGroup:userGroups):Observable<void>{
        return this._userGroups$$.update(userGroup)
    }

}