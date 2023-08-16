export interface ContextTemplate { 
  contextActivities: ContextActivities;
  extensions: { [key: string]: string };
}

export interface ContextActivities { 
  grouping: Activity[];
  category?: Activity[];
}

export interface Activity { 
  id: string;
  objectType: "Activity";
  definition?: Definition;
}

export interface Definition {
  name: { [key: string]: string };
  description: { [key: string]: string };
}