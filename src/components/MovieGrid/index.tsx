import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import type { MovieLight } from '../../types/api';
import './moviegrid.css';

interface MovieGridProps {
  movies: MovieLight[];
  emptyMessage?: string;
  onRemove?: (movieId: number) => void;
  removeIcon?: 'heart' | 'x';
  removeLabel?: string;
}

export function MovieGrid({
  movies,
  emptyMessage = 'Nenhum filme encontrado.',
  onRemove,
  removeIcon = 'x',
  removeLabel = 'Remover',
}: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="movie-grid-empty">{emptyMessage}</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-grid-card-wrapper">
          <Link to={`/filme/${movie.id}`} className="movie-grid-card" title={movie.title}>
            {movie.posterImageUrl ? (
              <img src={movie.posterImageUrl} alt={movie.title} />
            ) : (
              <div className="movie-grid-placeholder">{movie.title}</div>
            )}
            <div className="movie-grid-info">
              <span className="movie-grid-title">{movie.title}</span>
              <span className="movie-grid-year">{movie.releaseYear}</span>
            </div>
          </Link>

          {onRemove && (
            <button
              type="button"
              className="movie-grid-remove-btn"
              aria-label={`${removeLabel} "${movie.title}"`}
              title={removeLabel}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(movie.id);
              }}
            >
              {removeIcon === 'heart' ? (
                <Heart size={16} fill="#ffffff" />
              ) : (
                <X size={16} />
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
