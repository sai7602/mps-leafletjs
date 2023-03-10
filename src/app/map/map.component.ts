import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { parse, stringify, toJSON, fromJSON } from 'flatted';
import 'leaflet-arrowheads';
import { MarkerDataService } from '../marker-data-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private polyline!: L.Polyline;
  private markerIndex = 0;

  constructor(private markerDataService: MarkerDataService) {}

  ngOnInit(): void {
    this.initMap();
  }

  svgMarker = (index: number) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-icon-svg" style="width:52px; height:84"><filter id="iconShadowBlur"><feGaussianBlur in="SourceGraphic" stdDeviation="1"></feGaussianBlur></filter><path filter="url(#iconShadowBlur" )="" class="svg-icon-shadow" d="M 1 16 L 16 46 L 31 16 A 8 8 0 0 0 1 16 Z" fill="rgb(0,0,10)" stroke-width="2" stroke="rgb(0,0,10)" style="opacity: 0.5; transform-origin: 16px 48px; transform: rotate(45deg) translate(0px, 0px) scale(1, 0.75)"></path><path class="svg-icon-path" d="M 1 16 L 16 46 L 31 16 A 8 8 0 0 0 1 16 Z" stroke-width="2" stroke="rgb(0,102,255)" stroke-opacity="1" fill="rgb(0,102,255)" fill-opacity="0.4"></path><circle class="svg-icon-circle" cx="16" cy="16" r="8" fill="rgb(255,255,255)" fill-opacity="1" stroke="rgb(0,102,255)" stroke-opacity="1&quot;" stroke-width="2"></circle><text text-anchor="middle" x="16" y="18.8" style="font-size: 8px; font-weight: normal" fill="rgba(0, 0, 0,1)">${index}</text></svg>`;
  };

  private initMap(): void {
    // create a new map instance
    this.map = L.map('map', {
      center: [50.4851493, 30.4721233],
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
      autoPan: true,
      draggable: true,
      riseOnHover: true,
    });

    const form = document.createElement('form');
    form.innerHTML = `
      <label for="lat">Latitude:</label>
      <input type="text" name="lat" value="${latlng.lat}" required>
      <br>
      <label for="lng">Longitude:</label>
      <input type="text" name="lng" value="${latlng.lng}" required>
      <br>
      <label for="height">Height:</label>
      <input type="text" name="height" value="0">
      <br>
      <button type="submit">Save</button>
    `;

    marker.bindPopup(form);

    // add click event listener to the marker
    marker.on('click', () => {
      marker.openPopup();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // get the updated latitude, longitude, and height values
      const latInput = form.elements.namedItem('lat') as HTMLInputElement;
      const lngInput = form.elements.namedItem('lng') as HTMLInputElement;
      const heightInput = form.elements.namedItem('height') as HTMLInputElement;
      const lat = parseFloat(latInput.value);
      const lng = parseFloat(lngInput.value);
      const height = parseFloat(heightInput.value);

      // update the marker position and height
      marker.setLatLng([lat, lng]);
      marker.setZIndexOffset(height);

      // close the popup
      marker.closePopup();

      // update the polyline
      this.updatePolyline();
    });

    marker.on('dblclick', () => {
      this.removeMarker(marker);
      this.markerIndex--;
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
      className: 'number-icon',
      iconSize: [25, 41],
      iconAnchor: [10, 44],
      popupAnchor: [3, -40],
      html: this.svgMarker(this.markerIndex),
    });
    marker.setIcon(icon);
    marker.addTo(this.map);
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
    const latlngs = this.markers.map((marker, index) => {
      const icon = L.divIcon({
        className: 'number-icon',
        iconSize: [25, 41],
        iconAnchor: [10, 44],
        popupAnchor: [3, -40],
        html: this.svgMarker(index + 1),
      });
      return marker.getLatLng();
    });

    if (latlngs.length > 1) {
      this.polyline = L.polyline(latlngs, { color: 'red' }).arrowheads({
        color: 'red',
        yawn: 20,
        fill: true,
      });
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
    this.markerIndex = 0;
  }

  sendMarkerData() {
    // send marker data to server using the MarkerDataService

    this.markerDataService
      .sendMarkerDataToServer(stringify(this.markers))
      .subscribe({
        next: (response) => {
          console.log('Marker data sent successfully', response);
        },
        error: (error) => {
          console.log('Error sending marker data', error);
        },
      });
  }
}
