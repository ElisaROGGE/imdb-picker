import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie.model';

interface TopMovieEntry {
  rank: number;
  title: string;
  description: string;
  image: string;
  big_image: string;
  genre: string[];
  thumbnail: string;
  rating: string;
  id: string;
  year: number;
  imdbid: string;
  imdb_link: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);

  private rapidApiUrl = 'https://imdb-top-100-movies.p.rapidapi.com/';

  private topMovies = signal<TopMovieEntry[]>([]);
  private usedIds = new Set<string>();

  private rapidApiHeaders = {
    'X-RapidAPI-Key': environment.rapidApiKey,
    'X-RapidAPI-Host': environment.rapidApiHost
  };

  private fetchTopMovies(): Observable<TopMovieEntry[]> {
    if (this.topMovies().length > 0) {
      return of(this.topMovies());  
    }

    return this.http
      .get<TopMovieEntry[]>(this.rapidApiUrl, { headers: this.rapidApiHeaders })
      .pipe(tap(list => this.topMovies.set(list)));
  }

  getRandomMovie(): Observable<Movie> {
    return this.fetchTopMovies().pipe(
      switchMap(list => {
        const available = list.filter(entry => !this.usedIds.has(entry.id));

        if (available.length === 0) {
          this.usedIds.clear();
          return this.getRandomMovie();
        }

        const pick = available[Math.floor(Math.random() * available.length)];
        this.usedIds.add(pick.id);

        return this.http.get<Movie>(
          `${this.rapidApiUrl}${pick.id}`,
          { headers: this.rapidApiHeaders }
        );
      })
    );
  }

  resetHistory(): void {
    this.usedIds.clear();
  }
}