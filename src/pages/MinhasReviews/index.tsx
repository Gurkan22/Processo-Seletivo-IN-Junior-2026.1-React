import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { StarRatingDisplay } from '../../components/StarRating';
import { ReviewModal } from '../../components/ReviewModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import type { Review, Paginated } from '../../types/api';
import './minhasreviews.css';

export function MinhasReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<Review>>('/account/reviews', {
        params: { page: targetPage, perPage: 10 },
      });
      setReviews(res.data.data);
      setLastPage(res.data.metadata.lastPage);
      setPage(res.data.metadata.currentPage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleDelete = async () => {
    if (!deletingReview) return;
    await api.delete(`/reviews/${deletingReview.id}`);
    setDeletingReview(null);
    await load(page);
  };

  const handleUpdate = async (rating: number, text: string) => {
    if (!editingReview) return;
    await api.put(`/reviews/${editingReview.id}`, { rating, text });
    setEditingReview(null);
    await load(page);
  };

  return (
    <div className="minhas-reviews-page">
      <h1>Minhas Reviews</h1>

      {loading ? (
        <p className="minhas-reviews-loading">Carregando...</p>
      ) : reviews.length === 0 ? (
        <p className="minhas-reviews-empty">Você ainda não escreveu nenhuma review.</p>
      ) : (
        <>
          <div className="minhas-reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="minhas-reviews-card">
                <Link to={`/filme/${review.movie.id}`} className="minhas-reviews-poster">
                  {review.movie.posterImageUrl ? (
                    <img src={review.movie.posterImageUrl} alt={review.movie.title} />
                  ) : (
                    <div className="minhas-reviews-poster-placeholder">{review.movie.title}</div>
                  )}
                </Link>

                <div className="minhas-reviews-content">
                  <div className="minhas-reviews-header">
                    <Link to={`/filme/${review.movie.id}`} className="minhas-reviews-movie-title">
                      {review.movie.title} <span>({review.movie.releaseYear})</span>
                    </Link>
                    <div className="minhas-reviews-actions">
                      <button onClick={() => setEditingReview(review)} aria-label="Editar review">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeletingReview(review)} aria-label="Excluir review">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <StarRatingDisplay rating={review.rating} />
                  <p className="minhas-reviews-text">{review.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={page} lastPage={lastPage} onPageChange={load} />
        </>
      )}

      {editingReview && (
        <ReviewModal
          movieTitle={editingReview.movie.title}
          initialRating={editingReview.rating}
          initialText={editingReview.text}
          onClose={() => setEditingReview(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingReview && (
        <ConfirmModal
          title="Apagar avaliação"
          message={`Deseja apagar sua avaliação de "${deletingReview.movie.title}"? Esta ação é irreversível.`}
          confirmLabel="Apagar Avaliação"
          cancelLabel="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setDeletingReview(null)}
        />
      )}
    </div>
  );
}
