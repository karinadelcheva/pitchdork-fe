import React, { useState, useRef, useEffect } from 'react';
import type {Album} from '@/data/albums';
import AlbumCard from './AlbumCard';
import RatingSlider from './RatingSlider';
import ProgressIndicator from './ProgressIndicator';
import * as Tooltip from "@radix-ui/react-tooltip";
import { useIsMobile } from '@/hooks/use-mobile';


interface GameScreenProps {
  album: Album;
  userRating: number;
  currentRound: number;
  totalRounds: number;
  showResult: boolean;
  roundScore?: number;
}

const GameScreen: React.FC<GameScreenProps> = ({
                                                 album,
                                                 userRating,
                                                 currentRound,
                                                 totalRounds,
                                                 showResult,
                                                 roundScore,
                                               }) => {
  const isMobile = useIsMobile();
  const [showMobileHint, setShowMobileHint] = useState(false);
  const hintRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  useEffect(() => {
    if (!showMobileHint) return;
    function handleClick(e: MouseEvent) {
      if (hintRef.current && !hintRef.current.contains(e.target as Node)) {
        setShowMobileHint(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowMobileHint(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showMobileHint]);

  return (
    <div className="h-full flex flex-col md:gap-7">
      {/* Progress indicator */}
      <div className="flex justify-center mb-3">
        <ProgressIndicator current={currentRound} total={totalRounds}/>
      </div>

      {/* Album info */}
      <div className="flex-1 min-h-0">
        <AlbumCard
          album={album}
          userRating={userRating}
          showResult={showResult}
        />
      </div>

      {/* Rating slider & hint */}
      <div className="mt-auto pt-2">
        {showResult && roundScore !== undefined ? (
          <div className="text-left fade-in">
            <p className="text-xs text-muted-foreground">Round Score</p>
            <p className="text-xl font-bold text-primary">
              +{roundScore.toFixed(0)} pts
            </p>
          </div>
        ) : (
          <div className="relative inline-block">
            {isMobile ? (
              <>
                <button
                  type="button"
                  className="cursor-help bg-transparent border-none p-0 m-0 align-middle focus:outline-none"
                  onClick={() => setShowMobileHint((v) => !v)}
                  aria-label="Show hint"
                  aria-expanded={showMobileHint}
                  aria-controls="mobile-hint-box"
                >
                  <span role="img" aria-label="Hint">💡</span>
                </button>
                {showMobileHint && (
                  <div
                    id="mobile-hint-box"
                    ref={hintRef}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                  >
                    <div
                      className="max-w-md w-72 p-4 rounded-xl shadow-lg backdrop-blur-md bg-white/80 border border-white/20 text-gray-900 dark:text-white text-base whitespace-pre-line relative"
                      style={{
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                      }}
                    >
                      {album.small_text}
                      <button
                        type="button"
                        className="block ml-auto mt-2 text-xs text-blue-700 underline"
                        onClick={() => setShowMobileHint(false)}
                        aria-label="Close hint"
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger asChild>
                  <button type="button" className="cursor-help bg-transparent border-none p-0 m-0 align-middle focus:outline-none">
                    <span role="img" aria-label="Hint">💡</span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="top"
                  align="center"
                  className="z-50 max-w-md w-72 p-4 rounded-xl shadow-lg backdrop-blur-md bg-white/30 border border-white/20 text-gray-900 dark:text-white text-base whitespace-pre-line"
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                  }}
                >
                  {album.small_text}
                </Tooltip.Content>
              </Tooltip.Root>
            )}
            <p className="text-center fade-in text-[11px] text-muted-foreground mt-0">
              ↻ Use dial to rate • Press RATE to confirm
            </p>
            <RatingSlider value={userRating} min={0} max={10}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
