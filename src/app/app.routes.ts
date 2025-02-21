import { Routes } from '@angular/router';
import { WeatherComponent } from './modules/weather/components/weather.component';
import { HistoryComponent } from './modules/history/components/history.component';
import { FavoriteComponent } from './modules/favorite/components/favorite.component';

export const routes: Routes = [
  { path: '', redirectTo: '/weather', pathMatch: 'full' },
  { path: 'weather', component: WeatherComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'favorite', component: FavoriteComponent }
];
