import { MatTableDataSource } from "@angular/material/table";

import { Observable, Subscription } from "rxjs";

import { Assessment } from "@app/model/convs-mgr/conversations/assessments";

export class AssessmentDataSource extends MatTableDataSource<Assessment>{
    private _assessments$: Subscription;

    constructor(assessments: Observable<Assessment[]>){
        super();
        this._assessments$ = assessments.subscribe(_assessments => {
            this.data = _assessments;
        });
    }

    override disconnect(): void {
        this._assessments$.unsubscribe();
        super.disconnect();
    }
}