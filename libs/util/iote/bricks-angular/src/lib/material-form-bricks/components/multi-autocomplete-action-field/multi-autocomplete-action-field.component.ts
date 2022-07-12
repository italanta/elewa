import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { clone as ___clone } from 'lodash';

@Component({
  selector: 'iote-multi-autocomplete-action-field',
  templateUrl: './multi-autocomplete-action-field.component.html',
  styleUrls: [ './multi-autocomplete-action-field.component.scss' ]
})
export class MultiAutocompleteActionFieldComponent<G,I> implements OnChanges
{
  @Input() groups: G[];
  selectedItemNow = '';
  @Input() selectedItem: I;

  @Input() groupName:  (g: G) => string;
  @Input() groupItems: (g: G) => I[];

  @Input() itemFieldDisplayFn: (i: I) => string;
  @Input() highlightFn:        (i: I) => boolean;

  @Input() required: boolean;
  @Input() tooltipIsApproved: string;
  @Input() tooltipNeedApproval: string;

  @Output() itemSelected = new EventEmitter<I>();
  @Output() newItemTyped  = new EventEmitter<string | false>();
  @Input() icon :string;


  isLoaded = false;
  // isNew = false;
  // isCustomApproved = false;

  filter$$ = new BehaviorSubject<string>('');

  groupsDisplay$: Observable<G[]>;

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  ngOnInit()
  {
    if(this.selectedItem)
      this.selectedItemNow = this.itemFieldDisplayFn(this.selectedItem);

    this.groupsDisplay$ = this.filter$$
                              .pipe(map((filter) => this._filterGroups(this.groups, filter)));

    // this.filter$$.asObservable()
    //         .pipe(debounceTime(500))
    //         .subscribe(f => {
    //           this.isNew = true;
    //           this.selectedItemNow = f;
    //           this.isCustomApproved = false;
    //           this.newItemTyped.emit(false);
    //         });
  };

  private _filterGroups(groups: G[], filter: string)
  {
    // 1. The two conditions on which to show everthign
    if(filter == null || filter === '')
      return this._showAll(groups);
    if(groups == null)
      return [];

    filter = this._cleanFilter(filter);
    // 1.b. If one is selected - Show everything
    if(groups && groups.find(g => this.groupItems(g).find(i => this._cleanFilter(this.itemFieldDisplayFn(i)) === filter)))
      return this._showAll(groups);

    return groups.map(g => { filter = this._cleanFilter(filter);
                             if(this._cleanFilter(this.groupName(g)).indexOf(filter) >= 0)
                             { // Pass = Don't filter any of the group children
                               const cp = ___clone(g) as any;
                               cp.pass = true;
                               return cp;
                             }
                             else
                             {
                               const items = this.groupItems(g);

                               return items.find(i =>  this._cleanFilter(this.itemFieldDisplayFn(i)).indexOf(filter) >= 0) != null
                                         ? g
                                         : null;
                             };
                  })
                  .filter(g => g != null);
  }

  private _showAll = (gs: G[]) => gs.map(g => { g = ___clone(g); (g as any).pass = true; return g; });

  groupItemsInner(group: G)
  {
    const items = this.groupItems(group);
    if((group as any).pass)
      return items;

    const filter = this._cleanFilter(this.selectedItemNow);
    return items.filter(i =>  this._cleanFilter(this.itemFieldDisplayFn(i)).indexOf(filter) >= 0);
  }

  private _cleanFilter = (w: string) => w && w.toLowerCase().replace(' ', '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  onKeyUp(evt: Event)
  {
    // this.isNew = false;
    // this.isCustomApproved = false;
    // this.newItemTyped.emit(false);
    this.filter$$.next(this.selectedItemNow);
    this.newItemTyped.emit(this.selectedItemNow);
  }

  ngOnChanges(changes: SimpleChanges)
  {
    const items = changes['groups'];
    const selectedItem = changes['selectedItem'];

    if(items)
      this.groups = items.currentValue;

    if(selectedItem) {
      this.selectedItem = selectedItem.currentValue;
      this.selectedItemNow = this.itemFieldDisplayFn(selectedItem.currentValue);
    }
  }

  // /** Unknown item typed -> Emit event that requests parent to create item. */
  // onTypeSelectedItem(newItemName: any)
  // {
  //   this.isNew = true;
  //   // Item transferred upon approval below
  //   this.newItemTyped.emit(false);
  //   this.trigger.closePanel();
  // }

  // approve()
  // {
  //   this.isNew = false;
  //   this.isCustomApproved = true;
  //   this.newItemTyped.emit(this.selectedItemNow);
  // }

   /** Item selected -> Set item. */
   onSelectItem(evt: any)
   {
    //  this.isNew = false;
    //  this.isCustomApproved = false;

     const item = evt.option.value;
     this.selectedItemNow = this.itemFieldDisplayFn(item);
     this.itemSelected.emit(item);
   }

}
