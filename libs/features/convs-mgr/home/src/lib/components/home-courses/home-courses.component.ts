import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'italanta-apps-home-courses',
  templateUrl: './home-courses.component.html',
  styleUrls: ['./home-courses.component.scss'],
})
export class HomeCoursesComponent implements OnInit {
  courses = [
    {
      id: '1',
      name: 'ITC - Introduction to scouting',
      isPublished: true,
      platform: 'whatsapp',
    },
    {
      id: '2',
      name: 'ITC - Introduction to scouting ',
      isPublished: true,
      platform: 'messenger',
    },
    {
      id: '3',
      name: 'PTC - Preliminary scouting',
      isPublished: true,
      platform: 'in progress',
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  openCourse(courseId: string) {}
  openDeleteModal(course: any) {}
}
