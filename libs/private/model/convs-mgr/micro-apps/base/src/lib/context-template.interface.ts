/** This is required and defines the structure of subsequent requests from
 *    the AU.
 * 
 * Defines a JSON object that contains the common properties and values that
 *    must be included in the context of every cmi5 defined statement.
 */
export interface ContextTemplate
{
  contextActivities: ContextActivities;
  extensions: { [key: string]: string; };
}

export interface ContextActivities
{
  grouping: Activity[];
  category?: Activity[];
}

export interface Activity
{
  id: string;
  objectType: "Activity";
  definition?: Definition;
}

export interface Definition
{
  name: { [key: string]: string; };
  description: { [key: string]: string; };
}