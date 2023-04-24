import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { StoriesStore } from '@app/state/convs-mgr/stories';
import { ActiveOrgStore } from '@app/state/organisation';

import { QuestionMessage } from '@app/model/convs-mgr/conversations/messages';
import { Story } from '@app/model/convs-mgr/stories/main';

import { GroupProgressModel, MeasureGroupProgressCommand } from '@app/model/analytics/group-based/progress';
import { Organisation } from '@app/model/organisation';

@Component({
  selector: 'app-group-based-progress-chart',
  templateUrl: './group-based-progress-chart.component.html',
  styleUrls:  ['./group-based-progress-chart.component.scss'],
})
export class GroupBasedProgressChartComponent implements OnInit, OnDestroy
{
  @Input() model: QuestionMessage;
  @Input() chart: Chart;

  private _sBs = new SubSink();

  stories: Story[];
  currentOrg: Organisation;

  constructor(
    private _backend: HttpClient, 
    private _stories$$: StoriesStore,
    private _activeOrgStore$$: ActiveOrgStore,
  )
  {
    this._sBs.sink = this._stories$$.get().subscribe((stories) => this.stories = stories)
    this._sBs.sink = this._activeOrgStore$$.get().subscribe((org) => this.currentOrg = org)
  }

  ngOnInit() 
  { 
    const cmd = { 
      orgId: this.currentOrg.id,
      participantGroupIdentifier: 'all',
      interval: [1677283169, 1677887969, 1678492769, 1679097569, 1679702369, 1680307169, 1680935349, 1681540149], 
      storyGroupIdentifier: true 
    } as MeasureGroupProgressCommand;

    // TODO: Put properly into state
    this._backend
        .post('https://europe-west1-enabel-elearning.cloudfunctions.net/measureGroupProgress2',
              { data: cmd })
        .subscribe(
      (data: any) => 
      {
        const model = data.result as GroupProgressModel;
        console.log(model)
        this.chart = this._loadChart(model);
      });
  }

  private _loadChart(model: GroupProgressModel): Chart 
  {
    const milestones = ['Pre_Test', 'Onboarding', 'CH1_Systeme', 'CH2_Therapeutic', 'CH3_Indicateurs', 'CH4_Statistics', 'CH5_Maternity', 'Post_Test', 'Complete']
    const chapters = this.stories.map(story => story.chapter).filter(chapter => chapter != undefined)
    // const milestones = new Set<string>(chapters as string[])

    if (this.chart) {
      this.chart.destroy()
    }

    return new Chart('chart-ctx', 
    {
      type: 'bar',
      data: {
        labels: [_formatDate(new Date())],

        datasets: [...milestones].map((milestone, idx) => _unpackLabel(milestone, idx, model))
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

  ngOnDestroy(){
    if (this.chart) {
      this.chart.destroy()
    }

    this._sBs.unsubscribe()
  }
}

function _unpackLabel(milestone: string, idx: number, model: GroupProgressModel)
{
  return {
    label: milestone,
    data: [getData(milestone, model)],
    backgroundColor: _getColor(idx),
  };
}

function getData(milestone:string, model: GroupProgressModel): number {
  return model.measurements.find(m => m.name === milestone)?.participants.length ?? 0
}

function _formatDate(date: Date): string 
{
  return date.getDate() + '/' + (date.getMonth() + 1);
}

function _getColor(idx: number)
{
  return ['#e3342f', '#f6993f', '#f66d9b', '#ffed4a', '#4dc0b5', '#3490dc', '#6574cd', '#9561e2', '#38c172'][idx];
}
