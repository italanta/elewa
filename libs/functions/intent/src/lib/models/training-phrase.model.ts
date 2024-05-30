import { IObject } from "@iote/bricks";

export interface TrainingPhrase extends IObject{
  text: string; // User input example for the intent
}