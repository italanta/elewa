import { Component, Input } from '@angular/core';

@Component({
  selector: 'convl-italanta-apps-assessment-paginator',
  templateUrl: './assessment-paginator.component.html',
  styleUrls: ['./assessment-paginator.component.scss'],
})
export class AssessmentPaginatorComponent {
  @Input() totalItems: number;
  @Input() defaultPageSize: number;
  @Input() pageSizeOptions: number[];
  @Input() ariaLabel: String;

  constructor(){}
}
