import React from 'react';
import type { Album } from '@/data/albums';

interface RoundResult {
  album: Album;
  userRating: number;
  score: number;
}

interface ResultsScreenProps {
  results: RoundResult[];
  totalScore: number;
  maxPossibleScore: number;
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  totalScore,
  maxPossibleScore,
}) => {
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', message: "You're a true music critic!" };
    if (percentage >= 80) return { grade: 'A', message: 'Excellent ear for quality!' };
    if (percentage >= 70) return { grade: 'B', message: 'Pretty good taste!' };
    if (percentage >= 60) return { grade: 'C', message: 'Not bad at all!' };
    return { grade: 'D', message: 'Keep listening!' };
  };

  const { grade, message } = getGrade();

  return (
    <div className="h-full flex flex-col items-center justify-center text-center slide-up overflow-hidden">
      <h2 className="text-lg font-semibold text-muted-foreground mb-1">
        Game Over
      </h2>
      
      <div className="mb-2">
        <span className="text-5xl font-bold text-primary score-reveal">
          {grade}
        </span>
      </div>

      <p className="text-2xl font-bold text-foreground mb-1">
        {totalScore.toFixed(0)} pts
      </p>
      
      <p className="text-xs text-muted-foreground mb-4">
        {message}
      </p>

      {/* Mini results list */}
      <div className="w-full max-h-20 overflow-y-auto text-left px-2">
        {results.map((result, i) => (
          <div key={i} className="flex justify-between text-xs py-0.5 border-b border-border/50 last:border-0">
            <span className="truncate flex-1 text-muted-foreground">
              {result.album.artist}
            </span>
            <span className="text-foreground ml-2">
              {result.userRating.toFixed(1)} → {result.album.rating.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsScreen;
