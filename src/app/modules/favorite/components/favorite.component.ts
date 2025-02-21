import { Component, OnInit, Inject, PLATFORM_ID, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { WeatherService } from '../../../core/services/weather/weather.service';
import { PaginationPipe } from '../../../core/pipes/pagination/pagination.pipe';

export interface Favorite {
  city: string;
  tempC: string;
  tempF: string;
  localTime: string;
}

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationPipe],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteComponent implements OnInit {
  @Input() favorites: Favorite[] = [];
  @Output() favoritesChange = new EventEmitter<Favorite[]>();  

  favoritesLoaded = false;
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef  
  ) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadFavorites();
    }
  }

  async loadFavorites(): Promise<void> {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      this.favoritesLoaded = true;
      this.cdr.detectChanges();
    }
  }

  async addFavorite(city: string): Promise<void> {

    if (this.favorites.some(fav => fav.city === city)) return;

    const weatherData = await lastValueFrom(this.weatherService.getWeather(city));
    const newFavorite: Favorite = {
      city,
      tempC: weatherData?.current?.temp_c,
      tempF: weatherData?.current?.temp_f,
      localTime: weatherData?.location?.localtime,
    };

    this.favorites.push(newFavorite);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    this.favoritesChange.emit(this.favorites);
    this.cdr.detectChanges();
  }

  removeFavorite(city: string): void {
    this.favorites = this.favorites.filter(fav => fav.city !== city);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    this.favoritesChange.emit(this.favorites);
    this.cdr.detectChanges();
  }

  totalPages(): number {
    return Math.ceil(this.favorites.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}