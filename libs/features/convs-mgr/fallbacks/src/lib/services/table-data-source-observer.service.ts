import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from "rxjs";

export class TableDataSource<T> extends MatTableDataSource<T>{
  private _data$: Subscription;

  constructor(data: Observable<T[]>){
      super();
      this._data$ = data.subscribe(_data => {
          this.data = _data;
      });
  }

  override disconnect(): void {
      this._data$.unsubscribe();
      super.disconnect();
  }
}