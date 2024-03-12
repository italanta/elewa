import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteUserGroupModalComponent } from '../../modals/delete-user-group-modal/delete-user-group-modal.component';


@Component({
  selector: 'italanta-apps-single-user-data',
  templateUrl: './single-user-data.component.html',
  styleUrls: ['./single-user-data.component.scss'],
})
export class SingleUserDataComponent {
  displayedColumns=['name','phoneNumber','dateEnrolled', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator)paginator: MatPaginator;
  @ViewChild(MatSort) sort:MatSort;
  private _dialog: any;

  ngOnInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.fetchData()
  }

  fetchData() {
  }

  openDeleteModal() {
    this._dialog.open(DeleteUserGroupModalComponent)
    }

    openMoveModal() {
      throw new Error('Method not implemented.');
      }
}



