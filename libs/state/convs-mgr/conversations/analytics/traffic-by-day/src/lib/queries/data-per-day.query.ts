import { Injectable } from '@angular/core';
;
import { Observable, Subscription } from 'rxjs';
// import { map } from 'rxjs/operators';


/**
 * Calculates and reprensents data on a daily basis. */
@Injectable()
export class DataPerDayQuery
{
  // constructor(private _chatData$$: DataPerChatQuery) {}

  private _subscr: Subscription;

  get() : Observable<any>
  {
    // if(!this._subscr)
      // this._subscr = this._chatData$$
      //                    .get().pipe(map(data => this._byDay(data)));

    // return this._subscr as any;
    throw new Error('Not yet updated/implemented.')
  }

  // _byDay(data: { chat: Chat, messages: ChatMessage[], payments: Payment[] }[]) : any
  // {
  //   const chats = data.map(d => d.chat);
  //   const messages = _.flatMap(data, chat => chat.messages);
  //   const payments = _.flatMap(data, chat => chat.payments);

  //   const weekR = _.range(0, -7, -1).map(d => moment().add(d, 'days'));
  //   const week  = _.reverse(weekR);
  //   week.push(moment().add(1, 'day'));

  //   return week.map(d => ({
  //     day: d,

  //     chats: chats.filter(ch => __DateFromStorage(ch.createdOn).isSame(d, 'day')),
  //     messages: messages.filter(msg => __DateFromStorage(msg.date).isSame(d, 'day')),
  //     payments: payments.filter(msg => __DateFromStorage(msg.createdOn).isSame(d, 'day')),
  //   }));
  // }
}
