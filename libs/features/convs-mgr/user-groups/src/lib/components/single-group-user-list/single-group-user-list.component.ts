import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-single-group-user-list',
  templateUrl:'./single-group-user-list.component.html',
  styleUrls: ['./single-group-user-list.component.scss'],
})
export class SingleGroupUserListComponent {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'name',
    'phonenumber',
    'date',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource();

  allUsers = [{
    "name": "peter",
    "phoenenumber": 2,
    "date": "Today",
    "status": "Inactive"
  }];
  
  openAddModal() {

  }


  openDeleteModal() {

  }
}
