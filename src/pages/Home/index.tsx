import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { api } from '../../services/api';
import type { Genre, MovieLight, Review } from '../../types/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './home.css';

export function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<MovieLight[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<Record<number, MovieLight[]>>({});
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        
        const featuredResponse = await api.get('/movies/featured', { params: { count: 10 } });
        setFeaturedMovies(featuredResponse.data.data);

        const genresResponse = await api.get('/genres');
        const allGenres: Genre[] = genresResponse.data.data;
        setGenres(allGenres);

        const moviesByGenreEntries = await Promise.all(
          allGenres.map(async (genre) => {
            const res = await api.get('/movies', {
              params: { 'genreIds[]': genre.id, perPage: 10 },
            });
            return [genre.id, res.data.data] as const;
          })
        );
        setMoviesByGenre(Object.fromEntries(moviesByGenreEntries));

        const reviewsResponse = await api.get('/reviews/random', { params: { count: 6 } });
        setReviews(reviewsResponse.data.data);

      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="home-container">
      
  
      <section className="hero-section">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
        >
          {featuredMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <Link
                to={`/filme/${movie.id}`}
                className="hero-slide"
                style={{ textDecoration: 'none', backgroundImage: movie.posterImageUrl ? `url(${movie.posterImageUrl})` : undefined }}
              >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h2>{movie.title}</h2>
                  <p>{movie.releaseYear}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {genres.map((genre) => (
        <section key={genre.id} className="category-section">
          <h3>{genre.name}</h3>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {(moviesByGenre[genre.id] || []).map((movie) => (
              <SwiperSlide key={movie.id}>
                <Link to={`/filme/${movie.id}`} className="movie-card" title={movie.title}>
                  {movie.posterImageUrl && <img src={movie.posterImageUrl} alt={movie.title} />}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ))}

  
      <section className="reviews-section">
        <h3>O que estão achando...</h3>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <Link to={`/filme/${review.movie.id}`} className="review-poster">
                {review.movie.posterImageUrl ? (
                  <img src={review.movie.posterImageUrl} alt={review.movie.title} />
                ) : (
                  <div className="review-poster-placeholder">{review.movie.title}</div>
                )}
              </Link>
              <div className="review-content">
                <div className="review-header">
                  <Link to={`/filme/${review.movie.id}`} className="review-movie-title">
                    {review.movie.title} <span>{review.movie.releaseYear}</span>
                  </Link>
                  <span className="review-rating">⭐ {review.rating}/5</span>
                </div>
                <Link to={`/usuario/${review.user.id}`} className="review-author">
                  {review.user.fullName}
                </Link>
                <p className="review-text">"{review.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}