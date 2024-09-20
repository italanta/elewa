import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';

import { Observable } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { LocationMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { LocationBlockService } from '../../services/location-service';

@Component({
  selector: 'app-location-block-form',
  templateUrl: './location-block-form.component.html',
  styleUrl: './location-block-form.component.scss',
})
export class LocationBlockFormComponent implements OnInit, AfterViewInit {

  @ViewChild('mapsSearchField') searchElementRef: ElementRef;
  @ViewChild(GoogleMap) map: GoogleMap;

  @Input() id: string;
  @Input() block: LocationMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() locationMessageForm: FormGroup;
  @Input() isEdit: boolean;

  locationInputId: string;

  type: StoryBlockTypes;
  locationtype = StoryBlockTypes.Location;

  blockFormGroup: FormGroup;

  latitude: number;
  longitude: number;
  currentAddress: string = '';

  zoom: number = 5;
  address: string;

  markerPositions$: Observable<Map<string, google.maps.LatLng>>;
  bounds$: Observable<Map<string, google.maps.LatLngBounds>>;

  markerOptions: google.maps.MarkerOptions = { draggable: true };

  constructor(private ngZone: NgZone, private el: ElementRef, private renderer: Renderer2, private _locationBlockService: LocationBlockService) { }

  ngOnInit(): void {
    if (this.locationMessageForm) {
      this.latitude = this.locationMessageForm.value.locationInput.latitude;
      this.longitude = this.locationMessageForm.value.locationInput.longitude;
      this.currentAddress = this.locationMessageForm.value.locationInput.address;
    }

    this.markerPositions$ = this._locationBlockService.markerPositions$;
    this.bounds$ = this._locationBlockService.bounds$;
  }

  ngAfterViewInit(): void {
    this.setFocusOnInput();
    this.findAdress();
    if (this.locationMessageForm) {
      this.checkIfAddressExists();
    } 
  }

  private setFocusOnInput() {
    const inputElement = this.el.nativeElement.querySelector(`input[formControlName="name"]`);
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
  }

  checkIfAddressExists() {
    let address = this.locationMessageForm.value.locationInput;

    if (address && address.latitude && address.longitude) {
      this.latitude = address.latitude;
      this.longitude = address.longitude;
      this.currentAddress = address.address;
      const markerPositions = new google.maps.LatLng(this.latitude, this.longitude);
      this._locationBlockService.setMarkerPositions(this.id, markerPositions);
      let b = new google.maps.LatLngBounds(markerPositions);
      this._locationBlockService.setBounds(this.id, b);
      this.bounds$.subscribe((b)=> this.map.fitBounds(b.get(this.id) as google.maps.LatLngBounds));
      
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
          bounds.extend(place.geometry.location!);
        }

        this.zoom = 12;

        
        if (place.geometry.location!.lat() && place.geometry.location!.lng()) {
          this.latitude = place.geometry.location!.lat();
          this.longitude = place.geometry.location!.lng();
          
          // Patch the new address to the form
          const newAddress = {
            address: place.formatted_address,
            latitude: this.latitude,
            longitude: this.longitude,
          };

          this.locationMessageForm.patchValue({locationInput: {...newAddress}});

          
          const markerPositions = new google.maps.LatLng(this.latitude, this.longitude);
          this._locationBlockService.setMarkerPositions(this.id, markerPositions);
          this._locationBlockService.setBounds(this.id, bounds);
        }
      });
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    const markerPositions = event.latLng!;
    this._locationBlockService.setMarkerPositions(this.id, markerPositions); 
  }

  addressChanged(address: any) {
    this.currentAddress = address.target.value;    
  }
}
