import { Star } from 'lucide-react';
import { useState } from 'react';

const RatingStars = ({ rating = 0, setRating, editable = false, size = 16 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (editable && setRating) {
      setRating(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (editable) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((index) => {
        const starValue = hoverRating || rating;
        const isFilled = index <= starValue;
        return (
          <Star
            key={index}
            size={size}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors duration-150 ${
              editable ? 'cursor-pointer hover:scale-110' : ''
            } ${
              isFilled
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
