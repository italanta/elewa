export interface PaginationConfig
{
  /** Path to root collection. Interchanges collection and doc. */
  path: string[];

  /** Fn to orderBy - Prepares value into orderable value */
  orderByFn: (t: any) => any;
  /** Field to orderBy */
  orderByField: string;

  /** Limit per query */
  limit: number;
  /** Reverse order? */
  reverse: boolean;
   /** Prepend to source? */
  prepend: boolean;
}
