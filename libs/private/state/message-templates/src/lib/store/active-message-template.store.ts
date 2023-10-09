import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { Store } from "@iote/state";
import { combineLatest, filter, map, tap } from "rxjs";

import { MessageTemplate } from "@app/model/convs-mgr/functions";

import { MessageTemplateStore } from "./message-template.store";



@Injectable()
export class ActiveMessageTemplateStore extends Store<MessageTemplate> {
  protected store = 'active-message-template-store';
  _activeTemplate: string;

  constructor(private _templates$$: MessageTemplateStore,
              private _route: Router)
  {
    super(null as any);
    
    const templates$ = this._templates$$.get();

    const route$ = this._route.events.pipe( 
      filter((_event) => _event instanceof NavigationEnd),
      map((_event) => _event as NavigationEnd)
    );

    this._sbS.sink = combineLatest([templates$, route$]).pipe(
      tap(([templates, route]) => {
        const templatesId = this._getActiveTemplateId(route);
        const template = templates.find(_templates => _templates.id === templatesId);
          
        if(templatesId !== '__noop__' && template && this._activeTemplate !== templatesId){
          this._activeTemplate = templatesId;
          this.set(template, 'UPDATE - FROM DB || ROUTE');
        }
      })
    ).subscribe();
  }

  private _getUrlSegments(route: NavigationEnd){
    return route.url.split('/');
  }

  private _getActiveTemplateId(route: NavigationEnd){
    const urlSegments = this._getUrlSegments(route);
    const templatesIdSegment = urlSegments.length >= 3 ? urlSegments[2] : '__noop__';
    // Select templates Id portion without query params
    return templatesIdSegment.split("?")[0];
  }

  override get = () => super.get().pipe(filter(val => val != null));

  update = (templates: MessageTemplate) => this._templates$$.update(templates);
}
