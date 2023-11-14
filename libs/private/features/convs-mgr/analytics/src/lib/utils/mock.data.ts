import { Bot } from '@app/model/convs-mgr/bots';
import { Classroom } from '@app/model/convs-mgr/classroom';

// We use this to mock AllCourses and Allclassrooms options in our insights dashboard selection menu 
// Why? So we can avoid typescript gymnastics when selecting AllCourses and AllClassrooms.

export const AllCourse: Bot = {
  id: '',
  name: 'All',
  orgId: '',
  modules: [],
  type: 'Bot',
};

export const AllClassroom: Classroom = {
  id: '',
  className: 'All',
  description: '',
  deleted: false
};