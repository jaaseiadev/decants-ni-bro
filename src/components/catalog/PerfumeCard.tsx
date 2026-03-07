import Link from "next/link";
import { StarRating } from "./StarRating";
import { StatusPill } from "@/components/ui/status-pill";

interface PerfumeCardProps {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  accords: string[];
  status: string;
  price5ml: number;
  price10ml: number;
  rating: number;
  reviewCount: number;
  large?: boolean;
}

export function PerfumeCard({
  id,
  name,
  brand,
  imageUrl,
  accords,
  status,
  price5ml,
  price10ml,
  rating,
  reviewCount,
  large = false,
}: PerfumeCardProps) {
  return (
    <div className={`group relative flex flex-col overflow-hidden bg-white 
      ${large ? 'col-span-2 row-span-2' : 'col-span-1'} 
    `}>
      <Link href={`/perfume/${id}`} className="block w-full h-full relative group">
        <div className={`overflow-hidden relative bg-gray-50
          ${large ? 'aspect-[4/5]' : 'aspect-square'}
        `}>
          {/* Fallback gray box for now, should use next/image */}
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 group-hover:scale-105" />
          )}
          {status && (
            <div className="absolute top-4 left-4 z-10">
              <StatusPill status={status as "AVAILABLE" | "IN_TRANSIT" | "OUT_OF_STOCK"} />
            </div>
          )}
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">{brand}</p>
              <h3 className="text-xl font-serif mt-1 text-gray-900">{name}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900 font-medium">₱{price5ml} <span className="text-xs text-gray-500 font-normal">/ 5ml</span></p>
              <p className="text-sm text-gray-900 font-medium">₱{price10ml} <span className="text-xs text-gray-500 font-normal">/ 10ml</span></p>
            </div>
          </div>
          
          <div className="flex justify-between items-end mt-2">
            <div className="flex gap-2 text-xs text-gray-500">
              {accords.slice(0, 3).map(accord => (
                <span key={accord} className="bg-gray-100 px-2 py-1 rounded-full">{accord}</span>
              ))}
            </div>
            <StarRating rating={rating} count={reviewCount} />
          </div>
        </div>
      </Link>
    </div>
  );
}
