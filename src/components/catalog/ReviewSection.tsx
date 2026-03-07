"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
}

export function ReviewSection({ reviews: initialReviews }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    
    // Optimistic insert
    const newReview: Review = {
      id: Math.random().toString(),
      userInitials: "YOU",
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <h3 className="font-serif text-2xl mb-8">Customer Reviews</h3>
      
      <form onSubmit={handleSubmit} className="mb-12 bg-ds-nude/20 p-6 rounded-none border border-ds-greige/20">
        <h4 className="font-serif text-lg mb-4">Write a Review</h4>
        <div className="mb-4">
          <label className="block text-sm text-ds-taupe mb-2">Rating</label>
          <StarRating rating={rating} interactive onRatingChange={setRating} />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-ds-taupe mb-2">Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white border border-ds-greige p-3 focus:outline-none focus:border-ds-black min-h-[100px]"
            placeholder="Share your thoughts..."
            required
          />
        </div>
        <Button variant="primary" type="submit" disabled={!rating}>Submit Review</Button>
      </form>

      <div className="space-y-8">
        {reviews.map(review => (
          <div key={review.id} className="flex gap-4">
            <div className="w-10 h-10 bg-ds-black text-ds-ivory flex items-center justify-center font-serif flex-shrink-0">
              {review.userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
