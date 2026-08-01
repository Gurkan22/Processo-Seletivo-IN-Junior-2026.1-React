import { useState } from 'react';
import { X } from 'lucide-react';
import { StarRatingInput } from '../StarRating';
import './reviewmodal.css';

interface ReviewModalProps {
  movieTitle: string;
  initialRating?: number;
  initialText?: string;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => Promise<void>;
}

export function ReviewModal({ movieTitle, initialRating = 0, initialText = '', onClose, onSubmit }: ReviewModalProps) {

  const [rating, setRating] = useState(Number(initialRating) || 0);
  const [text, setText] = useState(initialText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Escolha uma quantidade de estrelas.');
      return;
    }
    if (text.trim().length === 0) {
      setError('Escreva algo sobre o filme.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(rating, text.trim());
    } catch {
      setError('Não foi possível salvar a review. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="review-modal-close" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <h2>Avaliar "{movieTitle}"</h2>

        <form onSubmit={handleSubmit}>
          <div className="review-modal-stars">
            <StarRatingInput value={rating} onChange={setRating} />
            <span className="review-modal-rating-value">{rating > 0 ? Number(rating).toFixed(1) : '—'}</span>
          </div>

          <textarea
            className="review-modal-textarea"
            placeholder="Escreva sua review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={2000}
          />

          {error && <p className="review-modal-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar review'}
          </button>
        </form>
      </div>
    </div>
  );
}
