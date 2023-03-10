import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-arrowheads';
@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.scss'],
})
export class Map2Component implements OnInit {
  private map2!: L.Map;
  private markers: L.Marker[] = [];
  private polyline!: L.Polyline;
  private markerIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // create a new map instance
    this.map2 = L.map('map2', {
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
    tiles.addTo(this.map2);

    // add click event listener to the map
    this.map2.on('click', (event: L.LeafletMouseEvent) => {
      console.log(event);
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

    marker.bindPopup('sfdsfdskj').openPopup();

    // add click event listener to the marker
    marker.on('click', () => {
      console.log(this.map2);
      // this.removeMarker(marker);
    });
    marker.on('dblclick', () => {
      console.log(this.markers);
      this.removeMarker(marker);
      this.markerIndex--;
    });

    // add dragend event listener to the marker
    marker.on('dragend', () => {
      this.updatePolyline();
    });

    // add the marker to the markers array
    this.markers.push(marker);
    console.log(this.markers);

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
      html: `<span>${this.markerIndex}</span>`,
    });
    marker.setIcon(icon);
    marker.addTo(this.map2);
  }

  private removeMarker(marker: L.Marker): void {
    // remove the marker from the map
    marker.removeFrom(this.map2);

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
      this.polyline.removeFrom(this.map2);
    }

    // create a new polyline from the markers
    const latlngs = this.markers.map((marker, index) => {
      const icon = L.divIcon({
        className: 'number-icon',
        iconSize: [25, 41],
        iconAnchor: [10, 44],
        popupAnchor: [3, -40],
        html: `<span>${index + 1}</span>`,
      });
      console.log(marker.setIcon(icon));
      return marker.getLatLng();
    });

    if (latlngs.length > 1) {
      this.polyline = L.polyline(latlngs, { color: 'red' }).arrowheads({
        color: 'red',
        yawn: 20,
        fill: true,
      });
      console.log(this.polyline);
      this.polyline.addTo(this.map2);
    }
  }
  public clearMarkers(): void {
    // remove all markers from the map
    this.markers.forEach((marker) => {
      marker.removeFrom(this.map2);
    });

    // empty the markers array
    this.markers = [];

    // remove the polyline from the map
    if (this.polyline) {
      this.polyline.removeFrom(this.map2);
      // this.polyline = null;
    }
    this.markerIndex = 0;
  }
}
