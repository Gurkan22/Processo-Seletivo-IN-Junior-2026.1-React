import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { api } from '../../services/api';
import { StarRatingDisplay } from '../../components/StarRating';
import type { PublicUser, MovieLight, Review } from '../../types/api';
import 'swiper/css';
import 'swiper/css/navigation';
import './perfil.css';

export function Perfil() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [favorites, setFavorites] = useState<MovieLight[]>([]);
  const [watched, setWatched] = useState<MovieLight[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/users/${id}/favorites`, { params: { perPage: 10 } }),
      api.get(`/users/${id}/watched`, { params: { perPage: 10 } }),
      api.get(`/users/${id}/reviews`, { params: { perPage: 10 } }),
    ])
      .then(([userRes, favRes, watchedRes, reviewsRes]) => {
        setUser(userRes.data.data);
        setFavorites(favRes.data.data);
        setWatched(watchedRes.data.data);
        setReviews(reviewsRes.data.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="perfil-loading">Carregando...</div>;

  if (notFound || !user) {
    return (
      <div className="perfil-loading">
        Usuário não encontrado. <Link to="/">Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.fullName ?? ''} className="perfil-avatar" />
        ) : (
          <div className="perfil-avatar-placeholder">{user.initials}</div>
        )}
        <h1>{user.fullName}</h1>
      </div>

      <section className="perfil-section">
        <h2>Favoritos</h2>
        {favorites.length === 0 ? (
          <p className="perfil-empty">Nenhum filme favoritado.</p>
        ) : (
          <Swiper modules={[Navigation]} navigation spaceBetween={16} slidesPerView={3}
            breakpoints={{ 640: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}>
            {favorites.map((movie) => (
              <SwiperSlide key={movie.id}>
                <Link to={`/filme/${movie.id}`} className="perfil-movie-card" title={movie.title}>
                  {movie.posterImageUrl && <img src={movie.posterImageUrl} alt={movie.title} />}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <section className="perfil-section">
        <h2>Assistidos</h2>
        {watched.length === 0 ? (
          <p className="perfil-empty">Nenhum filme assistido.</p>
        ) : (
          <Swiper modules={[Navigation]} navigation spaceBetween={16} slidesPerView={3}
            breakpoints={{ 640: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}>
            {watched.map((movie) => (
              <SwiperSlide key={movie.id}>
                <Link to={`/filme/${movie.id}`} className="perfil-movie-card" title={movie.title}>
                  {movie.posterImageUrl && <img src={movie.posterImageUrl} alt={movie.title} />}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <section className="perfil-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p className="perfil-empty">Nenhuma review escrita ainda.</p>
        ) : (
          <div className="perfil-reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="perfil-review-card">
                <Link to={`/filme/${review.movie.id}`} className="perfil-review-poster">
                  {review.movie.posterImageUrl ? (
                    <img src={review.movie.posterImageUrl} alt={review.movie.title} />
                  ) : (
                    <div className="perfil-review-poster-placeholder">{review.movie.title}</div>
                  )}
                </Link>
                <div className="perfil-review-content">
                  <Link to={`/filme/${review.movie.id}`} className="perfil-review-movie">
                    {review.movie.title} <span>({review.movie.releaseYear})</span>
                  </Link>
                  <StarRatingDisplay rating={review.rating} />
                  <p>{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
