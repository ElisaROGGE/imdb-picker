import { Component, input, signal } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  movie = input.required<Movie>();
  isFlipped = signal(false);

  flip(): void {
    this.isFlipped.set(true);
  }
}