import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TableElement } from '../models/table-element.model';

@Injectable({
  providedIn: 'root'
})

export class AITableDataService 
{
  getData(): Observable<TableElement[]> {
    const data: TableElement[] = [
      { userSays: 'Hi', action: 'Restart', actionDetails: '' },
      { userSays: 'Tell me about Elewa', action: 'Route', actionDetails: 'Elewa > Start' },
      { userSays: 'Tell me about Goomza', action: 'Route', actionDetails: 'Goomza > Start' },
      { userSays: 'Go back', action: 'Load last route', actionDetails: '' },
      { userSays: "Default/ Can't detect", action: 'Reload last message', actionDetails: '' },
      { userSays: "Skip", action: 'Next block', actionDetails: '' }
    ];
    return of(data);
  }
}