import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-survey-learners',
  templateUrl: './survey-learners.component.html',
  styleUrls: ['./survey-learners.component.scss'],
})
export class SurveyLearnersComponent {
  students: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      phoneNumber: '123-456-7890',
      course: 'Mathematics',
      surveyResponses: [
        { question: 'Q1', answer: 'Very Good' },
        { question: 'Q2', answer: 'Good' },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      phoneNumber: '987-654-3210',
      course: 'Physics',
      surveyResponses: [
        { question: 'Q1', answer: 'Good' },
        { question: 'Q2', answer: 'Excellent' },
      ],
    },
    {
      id: 3,
      name: 'Alice Johnson',
      phoneNumber: '555-123-4567',
      course: 'Biology',
      surveyResponses: [
        { question: 'Q1', answer: 'Very Good' },
        { question: 'Q2', answer: 'Excellent' },
      ],
    },
    {
      id: 4,
      name: 'Bob Wilson',
      phoneNumber: '333-789-4560',
      course: 'Chemistry',
      surveyResponses: [
        { question: 'Q1', answer: 'Poor' },
        { question: 'Q2', answer: 'Good' },
      ],
    },
    {
      id: 5,
      name: 'Eve Brown',
      phoneNumber: '444-987-6543',
      course: 'Computer Science',
      surveyResponses: [
        { question: 'Q1', answer: 'Excellent' },
        { question: 'Q2', answer: 'Very Good' },
      ],
    },
  ];
  

  displayedColumns: string[] = ['name', 'phone number', 'course'];
  dataSource: MatTableDataSource<Student>;

  searchControl = new FormControl();
  searchResults: Student[] = [];
  selectedStudent: Student | null = null; 
  selectedIndex: number = -1;

  constructor() {
    this.dataSource = new MatTableDataSource(this.students);

    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      return data.name.toLowerCase().includes(filter.toLowerCase());
    };

    this.searchControl.valueChanges.subscribe((value) => {
      this.dataSource.filter = value.trim().toLowerCase();
      this.searchResults = this.dataSource.filteredData;
      this.resetStudentDetails();
      if (this.searchResults.length > 0) {
        this.showSurveyResponses(this.searchResults[0]);
      }
    });
  }

  showSurveyResponses(student: Student) {
    this.selectedStudent = student;
    this.selectedIndex = this.searchResults.findIndex(
      (result) => result.id === student.id
    );
  }

  showPreviousStudent() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.showSurveyResponses(this.searchResults[this.selectedIndex]);
    }
  }

  showNextStudent() {
    if (this.selectedIndex < this.searchResults.length - 1) {
      this.selectedIndex++;
      this.showSurveyResponses(this.searchResults[this.selectedIndex]);
    }
  }

  resetStudentDetails() {
    this.selectedStudent = null;
    this.selectedIndex = -1;
  }
}

interface Student {
  id: number;
  name: string;
  phoneNumber: string;
  course: string;
  surveyResponses: SurveyResponse[];
}

interface SurveyResponse {
  question: string;
  answer: string;
}