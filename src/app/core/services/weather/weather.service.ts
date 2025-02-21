import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`);
  }

  getAutocomplete(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.json?key=${this.apiKey}&q=${city}`);
  }
}
