import { Actor } from "./actor.interface";
import { AUResult } from "./assignable-unit.interface";
import { ContextActivities } from "../../../cmi5/src/lib/context-template.interface";

export interface xAPIStatement 
{
  id: string;
  actor: Actor;
  verb: {
    id: string;
    display: {
      [key: string]: string;
    };
  };

  object: {
    id: string;
    objectType: string;

    definition: {
      name: {
        [key: string]: string;
      },
      description: {
        [key: string]: string;
      };
    };
  };

  result?: AUResult;

  context: {
    registration: string;
    contextActivities: ContextActivities;
  };

  extensions: {
    [key: string]: any;
  };
}