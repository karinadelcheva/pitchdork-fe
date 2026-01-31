import React from 'react';
import type {Album} from '@/data/albums';
import AlbumCard from './AlbumCard';
import RatingSlider from './RatingSlider';
import ProgressIndicator from './ProgressIndicator';
import * as Tooltip from "@radix-ui/react-tooltip";

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
          <div>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className={'cursor-help'}>💡</span>
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
            <p className="text-center fade-in text-[11px] text-muted-foreground mt-0">
              ↻ Use dial to rate • Press RATE to confirm
            </p>
            <RatingSlider value={userRating} min={0} max={10}/>
          </div>
        )
        }
      </div>
    </div>
  )
    ;
};

export default GameScreen;
