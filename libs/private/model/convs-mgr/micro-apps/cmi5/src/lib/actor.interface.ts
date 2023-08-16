export interface Actor
{
  objectType: "Agent";
  name: string;
  account: {
    organisation: string;
    class: string;
  };
}