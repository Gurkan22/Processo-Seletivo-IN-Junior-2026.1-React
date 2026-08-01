import { Star, StarHalf } from 'lucide-react';
import './starrating.css';

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
}


export function StarRatingDisplay({ rating, size = 16 }: StarRatingDisplayProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} size={size} fill="#22DA1C" color="#22DA1C" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} size={size} fill="#22DA1C" color="#22DA1C" />);
    } else {
      stars.push(<Star key={i} size={size} color="#C7C7CB" />);
    }
  }
  return <div className="star-rating-display">{stars}</div>;
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const handleClick = (starIndex: number, isHalf: boolean) => {
    const newValue = isHalf ? starIndex - 0.5 : starIndex;
    onChange(newValue);
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = value >= i;
    const halfFilled = value >= i - 0.5 && value < i;

    stars.push(
      <div key={i} className="star-input-wrapper">
        <button
          type="button"
          className="star-input-half star-input-half-left"
          onClick={() => handleClick(i, true)}
          aria-label={`${i - 0.5} estrelas`}
        />
        <button
          type="button"
          className="star-input-half star-input-half-right"
          onClick={() => handleClick(i, false)}
          aria-label={`${i} estrelas`}
        />
        {filled ? (
          <Star size={32} fill="#22DA1C" color="#22DA1C" />
        ) : halfFilled ? (
          <StarHalf size={32} fill="#22DA1C" color="#22DA1C" />
        ) : (
          <Star size={32} color="#C7C7CB" />
        )}
      </div>
    );
  }

  return <div className="star-rating-input">{stars}</div>;
}
