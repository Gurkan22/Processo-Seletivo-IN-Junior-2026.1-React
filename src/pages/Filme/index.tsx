import { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Eye, Star } from 'lucide-react';
import { api } from '../../services/api';
import { AuthContext } from '../../contexts/auth-context';
import { StarRatingDisplay } from '../../components/StarRating';
import { ReviewModal } from '../../components/ReviewModal';
import { Pagination } from '../../components/Pagination';
import type { MovieDetail, Review, Paginated } from '../../types/api';
import './filme.css';

export function Filme() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useContext(AuthContext);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLastPage, setReviewsLastPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [togglingWatched, setTogglingWatched] = useState(false);

  const loadMovie = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadReviews = useCallback(async (page: number) => {
    if (!id) return;
    const res = await api.get<Paginated<Review>>('/reviews', {
      params: { movieId: id, page, perPage: 10 },
    });
    setReviews(res.data.data);
    setReviewsLastPage(res.data.metadata.lastPage);
    setReviewsPage(res.data.metadata.currentPage);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    loadMovie();
    loadReviews(1);
  }, [loadMovie, loadReviews]);

  const toggleFavorite = async () => {
    if (!movie || togglingFavorite) return;
    setTogglingFavorite(true);
    try {
      if (movie.isFavorite) {
        await api.delete(`/account/favorites/${movie.id}`);
      } else {
        await api.post('/account/favorites', { movieId: movie.id });
      }
      setMovie({ ...movie, isFavorite: !movie.isFavorite });
    } finally {
      setTogglingFavorite(false);
    }
  };

  const toggleWatched = async () => {
    if (!movie || togglingWatched) return;
    setTogglingWatched(true);
    try {
      if (movie.isWatched) {
        await api.delete(`/account/watched/${movie.id}`);
      } else {
        await api.post('/account/watched', { movieId: movie.id });
      }
      setMovie({ ...movie, isWatched: !movie.isWatched });
    } finally {
      setTogglingWatched(false);
    }
  };

  const handleSubmitReview = async (rating: number, text: string) => {
    if (!movie) return;
    await api.post('/reviews', { movieId: movie.id, rating, text });
    setModalOpen(false);
    await loadMovie();
    await loadReviews(1);
  };

  if (loading) return <div className="filme-loading">Carregando...</div>;

  if (notFound || !movie) {
    return (
      <div className="filme-loading">
        Filme não encontrado. <Link to="/">Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <div className="filme-container">
      <div
        className="filme-banner"
        style={{ backgroundImage: movie.bannerImageUrl ? `url(${movie.bannerImageUrl})` : undefined }}
      >
        <div className="filme-banner-overlay" />
      </div>

      <div className="filme-header">
        <h1>{movie.title}</h1>
        {isAuthenticated && (
          <div className="filme-actions">
            <button
              className={`filme-action-btn ${movie.isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
              disabled={togglingFavorite}
              aria-label="Favoritar"
              title="Favoritar"
            >
              <Heart size={22} fill={movie.isFavorite ? '#AE1419' : 'none'} />
            </button>
            <button
              className={`filme-action-btn ${movie.isWatched ? 'active' : ''}`}
              onClick={toggleWatched}
              disabled={togglingWatched}
              aria-label="Marcar como assistido"
              title="Marcar como assistido"
            >
              <Eye size={22} fill={movie.isWatched ? '#1419AE' : 'none'} />
            </button>
          </div>
        )}
      </div>

      <div className="filme-body">
        <div className="filme-main-info">
          <p><strong>Ano:</strong> {movie.releaseYear}</p>
          {movie.durationMinutes && (
            <p><strong>Duração:</strong> {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}min</p>
          )}
          {movie.ageRating && (
            <p><span className="filme-age-badge">{movie.ageRating}</span> {movie.contentWarning}</p>
          )}
          <p className="filme-synopsis">{movie.synopsis}</p>
        </div>

        <div className="filme-side-info">
          {movie.cast && <p><strong>Elenco:</strong> {movie.cast}</p>}
          <p><strong>Gêneros:</strong> {movie.genres.map((g) => g.name).join(', ')}</p>
        </div>
      </div>

      <div className="filme-rating-row">
        <StarRatingDisplay rating={movie.avgRating ?? 0} size={24} />
        <span className="filme-rating-value">{movie.avgRating != null ? Number(movie.avgRating).toFixed(1) : '—'}</span>
        <span className="filme-rating-count">{movie.reviewCount} avaliações</span>
      </div>

      {isAuthenticated ? (
        <button className="btn-primary filme-review-btn" onClick={() => setModalOpen(true)}>
          <Star size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Criar uma review
        </button>
      ) : (
        <Link to="/login" className="filme-login-cta">
          Faça login para favoritar, marcar como assistido ou avaliar
        </Link>
      )}

      <section className="filme-reviews">
        <h2>Reviews</h2>
        {reviews.length === 0 && <p className="filme-no-reviews">Ainda não há reviews para este filme.</p>}
        <div className="filme-reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="filme-review-card">
              <div className="filme-review-user">
                {review.user.avatarUrl ? (
                  <img src={review.user.avatarUrl} alt={review.user.fullName ?? ''} />
                ) : (
                  <div className="filme-review-avatar-placeholder">{review.user.initials}</div>
                )}
                <span>{review.user.fullName}</span>
              </div>
              <StarRatingDisplay rating={review.rating} />
              <p className="filme-review-text">{review.text}</p>
            </div>
          ))}
        </div>
        <Pagination currentPage={reviewsPage} lastPage={reviewsLastPage} onPageChange={loadReviews} />
      </section>

      {modalOpen && (
        <ReviewModal
          movieTitle={movie.title}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
