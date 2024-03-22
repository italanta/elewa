import { IObject } from "@iote/bricks";

/**
 * Defines the options required to send a template message or start a survey
 *  on a selected schedule or specified date.
 */
export interface ScheduleOptions extends IObject
{
   /** JOB ID - As scheduled on GCP Tasks */
   jobID?: string;

   /**
    * The id of the survey or message template
    */
   objectID?: string;

   /** The time scheduled for the message to be sent 
    * 
    * For recurring messages, this will be the date the first
    *   job will be executed.
    */
   dispatchTime?: Date;
 
   /** Interval to send message templates to users in cron format */
   frequency?: string;

   rawSchedule?: any;
   
   /**
    * If it is a recurring schedule, the end date is the time the repetition will
    *  stop. We will use this to create a cloud task that will delete the gcloud schedule
    *   at the specified date. Because gcloud scheduler does not support 'repeat-until' feature.
    */
   endDate?: Date;

   inactivityTime?: number;

   milestone?: any;

   /**
    * The array of users id to send the message template/survey to
    */
   enrolledEndUsers?: string[];

   /**
    * The type of the job scheduled. Can be survey or just one message
    */
   type?: JobTypes;

   scheduleOption?: ScheduleOptionType;
}

export enum ScheduleOptionType {
   Milestone = 'milestone',
   Inactivity = 'inactivity',
   SpecificTime = 'time'
}

export enum JobTypes 
{
   /**
    * A survey type is when the user wants to send a survey at a particular time
    *   or recurring
    */
   Survey = 'survey',

   /**
    * A simple type is when the user wants to send a message template to users at
    *   a scheduled time.
    */
   SimpleMessage = 'simple-message',

   /**
    * A job scheduled to check for user inactivity and then send a message.
    */
   Inactivity = 'inactivity'
}