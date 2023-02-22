import { CatalogueItem } from './catalogue-item.interface';
import { IObject } from '@iote/bricks';

export const CATALOGUE_ID = 'catalogue-v1';

export interface Catalogue extends IObject
{
  offers: CatalogueItem[];
}
