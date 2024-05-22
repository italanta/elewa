import { Component } from '@angular/core';
import { TEST_DATA } from '../../utils/test-data';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent {

  assessmentQuestions = TEST_DATA

}
