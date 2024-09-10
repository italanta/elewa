import { Component, OnInit } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
  selector: 'convl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'conv-learning-manager';

  ngOnInit() {
    this._loadGoogleMapsScript();
  }

  private _loadGoogleMapsScript() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://maps.googleapis.com/maps/api/js?key='+ environment.firebase.maps +'&libraries=places';
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
  }
}
