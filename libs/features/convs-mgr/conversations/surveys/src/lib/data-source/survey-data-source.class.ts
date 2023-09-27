import { MatTableDataSource } from "@angular/material/table";
import { Survey } from "@app/model/convs-mgr/conversations/surveys";

import { Observable, Subscription } from "rxjs";


export class SurveyDataSource extends MatTableDataSource<Survey>{
    private _surveys$: Subscription;

    constructor(surveys: Observable<Survey[]>){
        super();
        this._surveys$ = surveys.subscribe(_surveys => {
            this.data = _surveys;
        });
    }

    override disconnect(): void {
        this._surveys$.unsubscribe();
        super.disconnect();
    }
}