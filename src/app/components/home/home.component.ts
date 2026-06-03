import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private movieService = inject(MovieService);

  movie = signal<Movie | null>(null);
  loading = signal(false);
  loadSeries = signal(false);
  error = signal<string | null>(null);

  pick(): void {
    this.loading.set(true);
    this.error.set(null);

    this.movieService.getRandomMovie().subscribe({
      next: (m) => {
        this.movie.set(m);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger un film, réessaie.');
        this.loading.set(false);
      }
    });
  }
}