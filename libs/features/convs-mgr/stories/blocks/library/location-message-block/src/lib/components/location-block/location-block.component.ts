import { FormGroup } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { MapsAPILoader } from '@agm/core';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { LocationMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-location-block',
  templateUrl: './location-block.component.html',
  styleUrls: ['./location-block.component.scss'],
})
export class LocationBlockComponent implements OnInit, AfterViewInit {

  @ViewChild('search') searchElementRef: ElementRef;

  @Input() id: string;
  @Input() block: LocationMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() locationMessageForm: FormGroup;

  locationInputId: string;

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  
  private geoCoder: google.maps.Geocoder;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone
) {}

  ngOnInit(): void { 
    this.findAdress();
  }
  

  ngAfterViewInit(): void 
  {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  findAdress() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const options = {}

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement, options
      );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude: any, longitude: any) {

    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  private _decorateInput()
   {
    let input = document.getElementById(this.locationInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

}
