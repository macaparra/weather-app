import { Component, OnInit, Inject, PLATFORM_ID, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../../core/services/weather/weather.service';
import { PaginationPipe } from '../../../core/pipes/pagination/pagination.pipe';

interface SearchHistoryItem {
  city: string;
  temperature: string;
  condition: string;
  localTime: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationPipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Output() citySelected = new EventEmitter<string>();
  searchHistory: SearchHistoryItem[] = [];
  favoritesLoaded = false;
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSearchHistory();
    }
  }

  loadSearchHistory(): void {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      this.searchHistory = JSON.parse(storedHistory);
      this.favoritesLoaded = true;
    }
  }

  saveSearchHistory(city: string, weatherData: any): void {
    const newHistoryItem: SearchHistoryItem = {
      city: city,
      temperature: `${weatherData.current.temp_c} °C`,
      condition: weatherData.current.condition.text,
      localTime: weatherData.location.localtime
    };
  
    const maxHistory = 10;
    if (!this.searchHistory.some(item => item.city === city)) {
      if (this.searchHistory.length >= maxHistory) {
        this.searchHistory.pop();
      }
      this.searchHistory.unshift(newHistoryItem);
    }
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
  
    this.loadSearchHistory();
  
    this.cdr.detectChanges();
  }
  

  selectFromHistory(city: string): void {
    this.citySelected.emit(city);
  }


  totalPages(): number {
    return Math.ceil(this.searchHistory.length / this.pageSize);
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
