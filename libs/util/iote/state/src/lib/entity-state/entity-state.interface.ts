export class EntityState<T>
{
  public entities: T[];
  public count: number;

  public loading: boolean;

  constructor(entities: T[], loading = false)
  {
    this.loading = loading;

    this.entities = entities;
    this.count = this.entities.length;
  }
}
