import { Component, OnInit } from '@angular/core';
import { TableElement } from '../../models/table-element.model';
import { TableDataSource } from '../../services/table-data-source-observer.service';
import { AITableDataService } from '../../services/table-data.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {
  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<TableElement> = new MatTableDataSource<TableElement>();

  constructor( private _dataService: AITableDataService,
  ){}

  ngOnInit(): void {
    this._dataService.getData().subscribe((data: TableElement[]) => {
      this.dataSource.data = data;
    });
  }
}
