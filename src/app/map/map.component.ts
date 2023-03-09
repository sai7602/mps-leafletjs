import { OnInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'leaflet';

interface CustomPolylineOptions extends L.PolylineOptions {
  arrowheads?: {
    size: string;
    frequency: string;
  };
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private polyline!: L.Polyline;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // create a new map instance
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });

    // add tile layer to the map
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
      }
    );
    tiles.addTo(this.map);

    // add click event listener to the map
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.addMarker(event.latlng);
    });
  }

  private addMarker(latlng: L.LatLng): void {
    // create a new marker and add it to the map
    const marker = L.marker(latlng, {
      draggable: true,
    });
    marker.addTo(this.map);

    // add click event listener to the marker
    marker.on('click', () => {
      this.removeMarker(marker);
    });

    // add dragend event listener to the marker
    marker.on('dragend', () => {
      this.updatePolyline();
    });

    // add the marker to the markers array
    this.markers.push(marker);

    // update the polyline
    this.updatePolyline();
    // increment the marker index
    this.markerIndex++;

    // create a new marker icon with the marker index
    const icon = L.divIcon({
      className: 'marker-label',
      html: `<span>${this.markerIndex}</span>`,
    });
    marker.setIcon(icon);
  }

  private removeMarker(marker: L.Marker): void {
    // remove the marker from the map
    marker.removeFrom(this.map);

    // remove the marker from the markers array
    const index = this.markers.indexOf(marker);
    if (index > -1) {
      this.markers.splice(index, 1);
    }

    // update the polyline
    this.updatePolyline();
  }

  private updatePolyline(): void {
    // remove the existing polyline from the map
    if (this.polyline) {
      this.polyline.removeFrom(this.map);
    }

    // create a new polyline from the markers
    const latlngs = this.markers.map((marker) => marker.getLatLng());
    const options: CustomPolylineOptions = {
      arrowheads: {
        size: '10px',
        frequency: '1',
      },
    };

    if (latlngs.length > 1) {
      this.polyline = L.polyline(latlngs, options);
      this.polyline.addTo(this.map);
    }
  }
  public clearMarkers(): void {
    // remove all markers from the map
    this.markers.forEach((marker) => {
      marker.removeFrom(this.map);
    });

    // empty the markers array
    this.markers = [];

    // remove the polyline from the map
    if (this.polyline) {
      this.polyline.removeFrom(this.map);
      // this.polyline = null;
    }
  }
  private markerIndex = 0;

  // private addMarker(latlng: L.LatLng): void {
  //   // increment the marker index
  //   this.markerIndex++;

  //   // create a new marker and add it to the map
  //   const marker = L.marker(latlng, {
  //     draggable: true,
  //   });
  //   marker.addTo(this.map);

  //   // add click event listener to the marker
  //   marker.on('click', () => {
  //     this.removeMarker(marker);
  //   });

  //   // add dragend event listener to the marker
  //   marker.on('dragend', () => {
  //     this.updatePolyline();
  //   });

  //   // add the marker to the markers array
  //   this.markers.push(marker);

  //   // update the polyline
  //   this.updatePolyline();
  //   // create a new marker icon with the marker index
  //   const icon = L.divIcon({
  //     className: 'marker-label',
  //     html: `<span>${this.markerIndex}</span>`,
  //   });
  //   marker.setIcon(icon);
  // }
}
