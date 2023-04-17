import { Chart } from 'chart.js/auto';

import { ActiveOrgStore } from '@app/state/organisation';

import { SubSink } from 'subsink';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { QuestionMessage } from '@app/model/convs-mgr/conversations/messages';

import { GroupProgressModel, MeasureGroupProgressCommand } from '@app/model/analytics/group-based/progress';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-group-based-progress-chart',
  templateUrl: './group-based-progress-chart.component.html',
  styleUrls:  ['./group-based-progress-chart.component.scss'],
})
export class GroupBasedProgressChartComponent implements OnInit, OnDestroy
{
  private _sbs = new SubSink()

  @Input() model: QuestionMessage;

  @Input() chart: Chart;

  currentOrgId: string

  constructor(private _backend: HttpClient, private _activeOrg: ActiveOrgStore)
  {
    this._sbs.sink = this._activeOrg.get().subscribe(org => this.currentOrgId = org.id as string)
  }

  ngOnInit() 
  { 
    // participantGroupIdentifier: '',
    const cmd = { 
      orgId:  this.currentOrgId, 
      participantGroupIdentifier:'all',
      interval: [1677283169, 1677887969, 1678492769, 1679097569, 1679702369, 1680307169, 1680935349, 1681540149], 
      storyGroupIdentifier: true 
    } as MeasureGroupProgressCommand;

    // TODO: Put properly into state
    this._backend
        .post('https://europe-west1-enabel-elearning.cloudfunctions.net/measureGroupProgress',
              { data: cmd })
        .subscribe(
      (data: any) => 
      {
        const model = data.result as GroupProgressModel;

        this.chart = this._loadChart(model);
      });

  }

  private _loadChart(model: GroupProgressModel): Chart 
  {
    const milestones = ['Pre_Test', 'Onboarding', 'CH1_Systeme', 'CH2_Therapeutic', 'CH3_Indicateurs', 'CH4_Statistics', 'CH5_Maternity', 'Post_Test', 'Complete']

    return new Chart('chart-ctx', 
    {
      type: 'bar',
      data: {
        labels: model.measurements.map(m => _formatDate(new Date(m.time * 1000))),

        datasets: milestones.map((milestone, idx) => _unpackLabel(milestone, idx, model))
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Course progression'
          },
        },
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy()
      this._sbs.unsubscribe()
    }
  }
}

function _unpackLabel(milestone: string, idx: number, model: GroupProgressModel)
{
  return {
    label: milestone,
    data: model.measurements.map(m => m.milestones.find(m => m.milestone === milestone)?.nParticipants ?? 0),
    backgroundColor: _getColor(idx),
  };
}

function _formatDate(date: Date): string 
{
  return date.getDate() + '/' + (date.getMonth() + 1);
}

function _getColor(idx: number)
{
  return ['#e3342f', '#f6993f', '#f66d9b', '#ffed4a', '#4dc0b5', '#3490dc', '#6574cd', '#9561e2', '#38c172'][idx];
}
