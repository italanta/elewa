import { Component } from '@angular/core';
import { AfterInactivityComponent } from '../../modals/after-inactivity/after-inactivity.component';
import { MilestoneReachedComponent } from '../../modals/milestone-reached/milestone-reached.component';
import { SpecificTimeComponent } from '../../modals/specific-time/specific-time.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-single-mesage-template-settings',
  templateUrl: './single-mesage-template-settings.component.html',
  styleUrls: ['./single-mesage-template-settings.component.scss'],
})
export class SingleMesageTemplateSettingsComponent {
  selectedOption: string;
  messageTemplateFrequency = [
    { value: 'milestone', viewValue: 'Milestone reached' },
    { value: 'specific-time', viewValue: 'Send message at specific time' },
    { value: 'inactivity', viewValue: 'After inactivity' },
  ];
  
  constructor(private _dialog: MatDialog){}
  openModal() {
    switch (this.selectedOption) {
      case 'milestone':
        const dialogRef1 = this._dialog.open(MilestoneReachedComponent);

        dialogRef1.componentInstance?.milestoneSelected.subscribe(
          (selectedData: any) => {
            console.log('Selected Milestone Data:', selectedData);
            const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'milestone');
            if (specificTimeOption) {
              specificTimeOption.viewValue = `${selectedData.milestoneType} ${selectedData.selectedMilestone} - ${selectedData.selectedStory.name}`;
            }
          }
        );
        break;
      case 'specific-time':
        const dialogRef = this._dialog.open(SpecificTimeComponent);
  
        dialogRef.componentInstance?.dateTimeSelected.subscribe((selectedDateTime: any) => {
          console.log(selectedDateTime)
          const formattedDateTime = `Send message at ${selectedDateTime.time} ${selectedDateTime.date.toLocaleString()}`;
          // Update the 'specific-time' option viewValue
          const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'specific-time');
          if (specificTimeOption) {
            specificTimeOption.viewValue = formattedDateTime;
          }
        });
        break;
      case 'inactivity':
        const inactivityDialogRef = this._dialog.open(AfterInactivityComponent);

        inactivityDialogRef.componentInstance?.timeInHoursSelected.subscribe(
          (selectedTime: number) => {
            console.log(`Selected time in hours: ${selectedTime}`);
            // Process the selected time in hours as needed
            const specificTimeOption = this.messageTemplateFrequency.find(option => option.value === 'inactivity');
            if (specificTimeOption) {
              specificTimeOption.viewValue = `Send message after ${selectedTime} of inactivity.`;
            }
          }
        );
        break;
      default:
        break;
    }
  }
  
}
