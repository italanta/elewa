import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AssessmentStatusTypes, AssessmentUserResults } from '@app/model/convs-mgr/micro-app/assessments';
import { formatDate } from '../../../utils/format-date.util';
import { GET_RANDOM_COLOR, GET_USER_AVATAR } from '../../../utils/getAvatar.util';

@Component({
  selector: 'app-assessment-users-table',
  templateUrl: './assessment-users-table.component.html',
  styleUrl: './assessment-users-table.component.scss'
})
export class AssessmentUsersTableComponent implements OnInit {
  @Input() assessmentUsers: AssessmentUserResults[];

  dataSource: MatTableDataSource<AssessmentUserResults>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  avatarColor: string;

  assessmentResults = ['icon', 'name', 'phone', 'dateDone', 'score', 'scoreCategory'];

  constructor(private _liveAnnouncer: LiveAnnouncer){}

  ngOnInit(): void {
    this.initDataSource()
  }

  getUserName = (name: string) => GET_USER_AVATAR(name);

  private initDataSource() {
    // this.dataSource = new MatTableDataSource(this.assessmentUsers);
    this.dataSource = new MatTableDataSource(this.assessmentUsers.map(x => ({
      ...x,
      avatarColor: GET_RANDOM_COLOR()
    })) as any)

    this.dataSource.sortingDataAccessor = (endUser, property) => {
      switch(property) {
        case 'phoneNumber': 
          return endUser.phoneNumber;
        case 'name': 
          return endUser.name;
        case 'dateDone': 
          return endUser.dateDone.getTime() as any;
        case 'score': 
          return endUser.score;
        case 'scoreCategory': 
          return endUser.scoreCategory;
        default: 
        return endUser[property as keyof AssessmentUserResults];
      }
    };

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  formatDate(date: Date) {
    return formatDate(date);
  }
}
