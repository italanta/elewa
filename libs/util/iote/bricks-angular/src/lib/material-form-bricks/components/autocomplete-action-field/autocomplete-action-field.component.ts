import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { filter as ___filter, orderBy as ___orderBy } from 'lodash';

@Component({
  selector: 'iote-autocomplete-action-field',
  templateUrl: './autocomplete-action-field.component.html',
  styleUrls: [ './autocomplete-action-field.component.scss' ]
})
export class AutocompleteActionFieldComponent<T> implements OnInit, OnChanges
{
  @Input() items: T[];
  displayItems: T[];
  selectedItemNow: string;
  @Input() selectedItem: T;
  @Input() itemFieldDisplayFn: (t: T) => string;
  @Input() highlightFn: (t: T) => boolean;
  @Input() required: boolean;
  @Input() icon :string;
  @Input() inputType = 'text';
  @Input() disable : boolean;

  @Output() itemSelected = new EventEmitter<T>();
  @Output() newItemTyped  = new EventEmitter<string>();

  private _filter = '';

  ngOnInit()
  {
    if(this.selectedItem)
      this.selectedItemNow = this.itemFieldDisplayFn(this.selectedItem);

    this.displayItems = this._getItems(this.items);
  };

  ngOnChanges(changes: SimpleChanges)
  {
    const items = changes['items'];
    const selectedItem = changes['selectedItem'];

    if(items)
      this.displayItems = this._getItems(items.currentValue);

    if(selectedItem) {
      this.selectedItem = selectedItem.currentValue;
      this.selectedItemNow = this.itemFieldDisplayFn(selectedItem.currentValue);
    }
  }

  /** Unknown item typed -> Emit event that requests parent to create item. */
  onTypeSelectedItem(evt: any)
  {
    this.newItemTyped.emit(evt.target.value);
  }

  onType(evt: any) {
    this._filter = evt.target.value;
    this.displayItems = this._getItems(this.items);
  }

  /** Item selected -> Set item. */
  onSelectItem(evt: any)
  {
    const item = evt.option.value;
    this.selectedItemNow = this.itemFieldDisplayFn(item);
    this.itemSelected.emit(item);
  }

  private _getItems = (items: T[]) => this.displayItems = this._sortFn(this._filterFn(items));

  private _filterFn(items: T[])
  {
    if((!this._filter || this._filter.length === 0))
      return items;

    const filter = this._sanitize(this._filter);
    return ___filter(items, (i: T) =>  this._sanitize(this._getName(i)).indexOf(filter) >= 0) as T[];
  }

  // Src: https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  private _sanitize = (tr: string) => tr.replace(' ', '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  private _sortFn   = (items: T[]) => ___orderBy(items, i => this._getName(i), 'asc');

  private _getName  = (item: T)    => this.itemFieldDisplayFn ? this.itemFieldDisplayFn(item) : (item as any) as string;
}
