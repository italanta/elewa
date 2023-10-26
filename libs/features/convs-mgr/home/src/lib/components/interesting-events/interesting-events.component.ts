import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'italanta-apps-interesting-events',
  templateUrl: './interesting-events.component.html',
  styleUrls: ['./interesting-events.component.scss'],
})
export class InterestingEventsComponent implements OnInit {

  events = [
    {
      name: 'ITC - Onboarding Whatsapp',
      desc : '✨25 Users started course ITC training',
      date : '11 Aug 2023'
    },
    {
      name: 'ITC - Onboarding Whatsapp',
      desc : '✨25 Users started course ITC training',
      date : '11 Aug 2023'
    },
    {
      name: 'ITC - Onboarding Whatsapp',
      desc : '✨25 Users started course ITC training',
      date : '11 Aug 2023'
    },
    {
      name: 'ITC - Onboarding Whatsapp',
      desc : '✨25 Users started course ITC training',
      date : '11 Aug 2023'
    },
    {
      name: 'ITC - Onboarding Whatsapp',
      desc : '✨25 Users started course ITC training',
      date : '11 Aug 2023'
    }
  ]
  constructor() {}

  ngOnInit(): void {}
}
