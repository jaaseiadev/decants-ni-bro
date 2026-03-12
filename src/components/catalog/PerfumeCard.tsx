import Link from "next/link";
import { StarRating } from "./StarRating";

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
  const isAvailable = status === "AVAILABLE";
  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in ordering a decant of ${brand} - ${name}.`);

  return (
    <div className={`group relative flex flex-col overflow-hidden bg-transparent mb-8
      ${large ? 'col-span-1 md:col-span-2 md:row-span-2' : 'col-span-1'} 
    `}>
      <Link href={`/perfume/${id}`} className="block w-full relative overflow-hidden bg-[#F5F5F3] mb-4">
        <div className={`relative overflow-hidden w-full 
          ${large ? 'aspect-[4/5] object-cover' : 'aspect-[3/4] object-cover'}
        `}>
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-[#E5E5E3] transition-transform duration-1000 group-hover:scale-105" />
          )}
          
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </Link>
      
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start">
          <p className="font-serif italic text-sm text-[#8b8077] tracking-wider">{brand}</p>
        </div>
        <h3 className="text-xl md:text-2xl font-serif text-[#0A0A0A] leading-snug">{name}</h3>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm font-light tracking-wide text-[#333]">
            From ₱{price5ml}
          </p>
          <a
            href={`https://wa.me/639123456789?text=${whatsappMsg}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs uppercase tracking-widest border-b border-[#0A0A0A] pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
          >
            Inquire
          </a>
        </div>
      </div>
    </div>
  );
}
