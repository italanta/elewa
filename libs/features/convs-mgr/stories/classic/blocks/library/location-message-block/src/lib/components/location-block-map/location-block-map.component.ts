import { Component, Input, OnInit } from '@angular/core';


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



