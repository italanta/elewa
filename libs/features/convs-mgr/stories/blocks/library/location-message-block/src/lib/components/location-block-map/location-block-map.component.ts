import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';


interface JsPlumb {
  // Add the properties and methods of jsPlumb
  // For example:
  connect(source: string, target: string): void;
  // ...
}

@Component({
  selector: 'app-location-block-map',
  templateUrl: './location-block-map.component.html',
  styleUrls: ['./location-block-map.component.scss'],

})
export class LocationBlockMapComponent implements OnInit{

  @Input() longitude: number;
  @Input() latitude: number;

  markerPositions: google.maps.LatLngLiteral[] = [];
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  locationInputId: string = 'uniqueId' + Date.now();


  constructor() {}

  ngOnInit(): void {
    this.initMap();
  } 

 initMap(){
    const gfg_office={
      lng: this.longitude,
      lat: this.latitude
    };
  
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 18.00,
        center: gfg_office,
      });
    
      const marker = new google.maps.Marker({
        position: gfg_office,
        map: map,
      });
    }



  
  }



