import React from 'react';
import type { Album } from '@/data/albums';

interface AlbumCardProps {
  album: Album;
  userRating: number;
  showResult?: boolean;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ 
  album, 
  userRating,
  showResult = false 
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex gap-0.5 text-sm">
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={`full-${i}`} className="text-primary">★</span>
        ))}
        {hasHalfStar && <span className="text-primary">✦</span>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={`empty-${i}`} className="text-muted-foreground/40">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex gap-4 fade-in">
      {/* Album Cover */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-muted">
        <img
          src={album.album_art_url}
          alt={`${album.album} by ${album.artist}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Album Info */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-foreground text-lg leading-tight truncate">
          {album.album}
        </h2>
        <p className="text-muted-foreground text-sm truncate">
          {album.artist}
        </p>
        <p className="text-muted-foreground/60 text-xs">
          {album.year_released}
        </p>

        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-0.5">Your Rating</p>
          <div className="flex items-center gap-2">
            {renderStars(userRating)}
            <span className="text-sm font-semibold text-foreground">
              {userRating.toFixed(1)}
            </span>
          </div>
        </div>

        {showResult && (
          <div className="mt-2 score-reveal">
            <p className="text-xs text-muted-foreground">Pitchfork Rating</p>
            <p className="font-bold text-lg text-primary">
              {album.rating.toFixed(1)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;
