export interface DomainStructure {
  url: string;
  domain: Domain;
  type: string;
  id: string;
  action?: string;
}

export enum Domain {
  business = 'business',
  operations = 'operations',
  budgets = 'budgets',
  settings = 'settings',
  home = 'home'
}