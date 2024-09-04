import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { Store } from "@iote/state";
import { combineLatest, filter, map, tap } from "rxjs";

import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

import { MessageTemplateStore } from "./message-template.store";

@Injectable()
export class ActiveMessageTemplateStore extends Store<TemplateMessage> {
  protected store = 'active-assessment-store';
  _activeTemplateId: string;
  _activeTemplate: TemplateMessage;

  constructor(private _template$$: MessageTemplateStore,
              private _route: Router)
  {
    super(null as any);
    
    const templates$ = this._template$$.get();

    const route$ = this._route.events.pipe(
      filter((_event) => _event instanceof NavigationEnd),
      map((_event) => _event as NavigationEnd)
    );

    this._sbS.sink = combineLatest([templates$, route$]).subscribe(
      ([templates, route]) => {
        const templateId = this._getTemplateId(route);
        const template = templates.find(_template => _template.id === templateId);
          
        if(template){
          this._activeTemplateId = templateId ? templateId : "";
          this._activeTemplate = template;
          this.set(template, 'UPDATE - FROM DB || ROUTE');
        }
      }
    );
  }

  private _getTemplateId(route: NavigationEnd) {
    const url = route.url;
    const isUsersRoute = url.includes('/users');
    const urlSegments = url.split('/');
    
    if (isUsersRoute && url.includes('?')) {
      const queryString = url.split('?')[1]; // Extracts the query string part of the URL
      const params = new URLSearchParams(queryString);
      return params.get('templateId');
    }
    
    const templateIdSegment = urlSegments.length >= 3 ? urlSegments[2] : '__noop__';
    return templateIdSegment.split("?")[0];
  }

  override get = () => super.get().pipe(filter(val => val != null));

}
