import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ rating, count, interactive = false, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`p-0 bg-transparent border-none ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          >
            <Star
              size={16}
              className={star <= rating ? "fill-current" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
}
