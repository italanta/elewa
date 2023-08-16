export interface Actor
{
  objectType: "Agent";
  name: string;
  account: {
    endUserId: string;
    organisation: string;
    class: string;
  };
}