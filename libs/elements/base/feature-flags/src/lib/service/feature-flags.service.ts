import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService {
  private flags: any = {};

  constructor(private http: HttpClient) {}

  private loadFeatureFlags(): Observable<any> {
    return this.http.get('/assets/flags/featureFlags.json');
  }

  init(): Subscription {
    return this.loadFeatureFlags().subscribe(data => {
      this.flags = data;
    });
  }

  // In FeatureFlagsService
  setFeatureFlag(featureName: string, value: boolean): void {
    this.flags[featureName] = value;
  }


    // In FeatureFlagsService
  isFeatureOn(featureName: string): boolean {
    const value = this.flags[featureName] || false;
    return value;
  }
}
