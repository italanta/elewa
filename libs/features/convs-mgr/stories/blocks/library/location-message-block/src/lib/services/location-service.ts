import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationBlockService {
  private markerPositions = new BehaviorSubject<Map<string, google.maps.LatLng>>(new Map());
  markerPositions$ = this.markerPositions.asObservable();

  private bounds = new BehaviorSubject<Map<string, google.maps.LatLngBounds>>(new Map());
  bounds$ = this.bounds.asObservable();

  setMarkerPositions(id: string, value: google.maps.LatLng) {
    const current = this.markerPositions.getValue();
    current.set(id, value);
    this.markerPositions.next(current);
  }


  setBounds(id: string, value: google.maps.LatLngBounds) {
    const current = this.bounds.getValue();
    current.set(id, value);
    this.bounds.next(current);
  }
}