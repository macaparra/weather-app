import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { WeatherService } from '../../../core/services/weather/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core'; 
import { Favorite, FavoriteComponent } from '../../favorite/components/favorite.component';
import { HistoryComponent } from '../../history/components/history.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, FavoriteComponent, HistoryComponent],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit {
  city: string = '';
  weatherData: any;
  suggestions: string[] = [];
  searchTerm = new Subject<string>();
  errorMessage: string = '';
  favorites: Favorite[] = [];
  searchHistory: { city: string, localTime: string }[] = []; 

  @ViewChild(HistoryComponent) historyComponent!: HistoryComponent;

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFavorites();
    }
    
    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => this.weatherService.getAutocomplete(term))
    ).subscribe(
      (data: any) => {
        this.suggestions = data.map((item: any) => item.name);
      },
      (error) => {
        console.error('Error fetching autocomplete:', error);
        this.suggestions = [];
      }
    );
  }

  searchWeather(): void {
    if (!this.city.trim()) {
      this.errorMessage = 'Por favor, introduce un nombre de ciudad válido.';
      return;
    }
  
    this.errorMessage = '';
  
    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.addSearchHistory(this.city, this.weatherData.location.localtime);
        
        if (this.historyComponent) {
          this.historyComponent.saveSearchHistory(this.city, this.weatherData);
        }
  
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error obteniendo datos del clima:', error);
        this.errorMessage = 'Ciudad no encontrada. Intenta de nuevo.';
      }
    );
  }
  
addSearchHistory(city: string, localTime: string): void {
  const newHistory = { city, localTime };
  this.searchHistory = [newHistory, ...this.searchHistory];
  if (this.searchHistory.length > 5) { 
    this.searchHistory = this.searchHistory.slice(0, 5);
  }
}

  
  
  onCityInput(): void {
    if (this.city.length > 2) {
      this.searchTerm.next(this.city);
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(city: string): void {
    this.city = city;
    this.suggestions = [];
    this.searchWeather();
  }

  loadFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        this.favorites = JSON.parse(storedFavorites);
      }
    }
  }

  toggleFavorite(): void {
    if (!this.weatherData) return;
    const cityName = this.weatherData.location.name;
  
    const isFavorite = this.favorites.some(fav => fav.city === cityName);
  
    if (isFavorite) {
      this.favorites = this.favorites.filter(fav => fav.city !== cityName);
    } else {
      const newFavorite: Favorite = {
        city: cityName,
        tempC: this.weatherData.current.temp_c,
        tempF: this.weatherData.current.temp_f,
        localTime: this.weatherData.location.localtime,
      };
      this.favorites = [...this.favorites, newFavorite];
      
      if (this.favorites.length === 1) {
        window.location.reload(); 
      }
    }
  
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  
    this.cdr.detectChanges();
  }
  
  

  isFavorite(): boolean {
    return this.weatherData && this.favorites.some(fav => fav.city === this.weatherData.location.name);
  }

  updateFavorites(favorites: Favorite[]): void {
    this.favorites = favorites;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  
    this.cdr.detectChanges();
  }

  onCitySelected(city: string): void {
    this.city = city;
    this.suggestions = [];
    this.cdr.detectChanges();
    this.searchWeather();
  }
}