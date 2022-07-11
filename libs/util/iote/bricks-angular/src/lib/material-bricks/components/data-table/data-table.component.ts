import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent
{
    dataSource: MatTableDataSource<any>;

    @Input() displayedColumns: any[];
    @Input() data: any[];

    ngOnInit()
    {
        this.dataSource = new MatTableDataSource<any>(this.data);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {
          return data.name.toLowerCase().includes(filter);
        };
    }

}
