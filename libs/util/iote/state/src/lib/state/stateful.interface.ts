import { Observable } from 'rxjs';

export interface Stateful<T>
{
  get() : Observable<T>;
}
