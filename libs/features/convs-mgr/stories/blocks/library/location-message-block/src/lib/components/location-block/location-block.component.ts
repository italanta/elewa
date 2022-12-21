import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { LocationMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-location-block',
  templateUrl: './location-block.component.html',
  styleUrls: ['./location-block.component.scss'],
})
export class LocationBlockComponent implements OnInit, AfterViewInit {

  @ViewChild('mapsSearchField') searchElementRef: ElementRef;
  @ViewChild(GoogleMap) map: GoogleMap;

  @Input() id: string;
  @Input() block: LocationMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() locationMessageForm: FormGroup;

  locationInputId: string;

  type: StoryBlockTypes;
  locationtype = StoryBlockTypes.Location;

  blockFormGroup: FormGroup;

  latitude: number;
  longitude: number;
  currentAddress: string = '';

  zoom: number = 5;
  address: string;


  markerPositions: google.maps.LatLng;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    if (this.locationMessageForm) {
      this.latitude = this.locationMessageForm.value.locationInput.latitude;
      this.longitude = this.locationMessageForm.value.locationInput.longitude;
      this.currentAddress = this.locationMessageForm.value.locationInput.address;
    }
  }

  ngAfterViewInit(): void {
    this.findAdress();
    if (this.locationMessageForm) {
      this.checkIfAddressExists();
    }
  }

  checkIfAddressExists() {
    let address = this.locationMessageForm.value.locationInput;

    if (address && address.latitude && address.longitude) {
      this.latitude = address.latitude;
      this.longitude = address.longitude;
      this.currentAddress = address.address;
      this.markerPositions = new google.maps.LatLng(this.latitude, this.longitude);
      let b = new google.maps.LatLngBounds(this.markerPositions);
      this.map.fitBounds(b);
    }
  }

  findAdress() {
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

        const bounds = new google.maps.LatLngBounds();

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        this.zoom = 12;

        if (place.geometry.location.lat() && place.geometry.location.lng()) {
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
  
          this.map.fitBounds(bounds)
          this.markerPositions = new google.maps.LatLng(this.latitude, this.longitude)
        }
      });
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions = event.latLng;
  }

  addressChanged(address: any) {
    this.currentAddress = address.target.value;    
  }
}
