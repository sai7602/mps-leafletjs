import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MarkerDataService {
  constructor(private http: HttpClient) {}

  sendMarkerDataToServer(markerData: any): Observable<any> {
    return this.http.post('https://example.com/marker-data', markerData);
  }
}
