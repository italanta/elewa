import { BehaviorSubject } from "rxjs";
import { Injectable, TemplateRef } from "@angular/core";

/**
 * Services that allows child routed components to set data into the navbar.
 */
@Injectable({
  providedIn: 'root'
})
export class BuilderNavBarElementsProvider
{
  private _els$$: BehaviorSubject<{ template: TemplateRef<any>, context: any}> = new BehaviorSubject(null as any);

  constructor() {
    console.log('Loaded navbar bridge.');
  }

  /** Get the template ref needed to populate the top menu */
  public setBuilderNavElements = (template: TemplateRef<any>, context: any) => this._els$$.next({ template, context });
  /** Get the template ref needed to populate the top menu */
  public getBuilderNavElements$ = () => this._els$$.asObservable();
  /** Get the template ref needed to populate the top menu */
  public clearBuilderNavElements = () => this._els$$.next(null as any);

}