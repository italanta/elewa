import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'italanta-apps-home-courses',
  templateUrl: './home-courses.component.html',
  styleUrls: ['./home-courses.component.scss'],
})
export class HomeCoursesComponent implements OnInit {

  courses = [
    {
      id: "1",
      name: " Course 1 ",
      isPublished: false,
      platform: 'whatsapp'
    },
    {
      id: "2",
      name: " Introduction to scouting ",
      isPublished: true,
      platform: 'telegram'
    },
    {
      id: "3",
      name: " Introduction to scouting ",
      isPublished: true,
      platform: 'whatsapp'
    },
  ]
  constructor() { }

  ngOnInit(): void { }

  openCourse(courseId: string) {

  }
  openDeleteModal(course: any) {

  }
}
