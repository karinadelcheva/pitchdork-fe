import React, {useState, useCallback, useMemo} from 'react';
import IPodScreen from './IPodScreen';
import ClickWheel from './ClickWheel';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import ResultsScreen from './ResultsScreen';
import {MAX_SCORE_PER_ROUND, TOTAL_ROUNDS} from "@/const.ts";
import {Album, albumService} from "@/data/AlbumService.ts";

type GameState = 'start' | 'playing' | 'result' | 'finished';

interface RoundResult {
  album: Album;
  userRating: number;
  score: number;
}

const calculateScore = (userRating: number, actualRating: number): number => {
  const difference = Math.abs(userRating - actualRating);
  // Max difference is 10, so we scale it
  // 0 difference = 100 points, 10 difference = 0 points
  const score = Math.max(0, MAX_SCORE_PER_ROUND - (difference * 10));
  return Math.round(score);
};


const PitchforkGame: React.FC = (props: { initialAlbums: Album[] }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentRound, setCurrentRound] = useState(0);
  const [userRating, setUserRating] = useState(5.0);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentRoundScore, setCurrentRoundScore] = useState<number | undefined>();


  // Shuffle albums at game start
  const [gameAlbums, setGameAlbums] = useState<Album[]>(props.initialAlbums);

  const currentAlbum = gameAlbums[currentRound];

  const totalScore = useMemo(() =>
      results.reduce((sum, r) => sum + r.score, 0),
    [results]
  );

  const maxPossibleScore = TOTAL_ROUNDS * MAX_SCORE_PER_ROUND;

  const handleAgain = useCallback ( async () => {
    const newAlbums = await albumService.getRandomAlbums(TOTAL_ROUNDS);
    // Reset game
    setGameAlbums(newAlbums);
    setCurrentRound(0);
    setUserRating(5.0);
    setShowResult(false);
    setResults([]);
    setCurrentRoundScore(undefined);
    setGameState('playing');
  }, []);

  const handleStart = useCallback(() => {
    // Reset game
    setGameAlbums(props.initialAlbums);
    setCurrentRound(0);
    setUserRating(5.0);
    setShowResult(false);
    setResults([]);
    setCurrentRoundScore(undefined);
    setGameState('playing');
  }, []);

  const handleConfirmRating = useCallback(() => {
    if (gameState === 'start') {
      handleStart();
      return;
    }

    if (gameState === 'finished') {
      handleAgain();
      return;
    }

    if (gameState === 'playing') {
      if (!showResult) {
        // Show the result
        const score = calculateScore(userRating, currentAlbum.rating);
        setCurrentRoundScore(score);
        setResults(prev => [...prev, {
          album: currentAlbum,
          userRating,
          score,
        }]);
        setShowResult(true);
      } else {
        // Move to next round or finish
        if (currentRound < TOTAL_ROUNDS - 1) {
          setCurrentRound(prev => prev + 1);
          setUserRating(5.0);
          setShowResult(false);
          setCurrentRoundScore(undefined);
        } else {
          setGameState('finished');
        }
      }
    }
  }, [gameState, showResult, userRating, currentAlbum, currentRound, handleStart]);

  const getScreenTitle = () => {
    switch (gameState) {
      case 'start':
        return 'Pitchfork Game';
      case 'playing':
        return `Album ${currentRound + 1} of ${TOTAL_ROUNDS}`;
      case 'finished':
        return 'Final Score';
      default:
        return 'Pitchfork Game';
    }
  };

  const getCenterLabel = () => {
    if (gameState === 'start') return 'START';
    if (gameState === 'finished') return 'AGAIN';
    if (showResult) return 'NEXT';
    return 'RATE';
  };

  const showScreenIcons = gameState === 'start' || gameState === 'finished';

  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center">
      <img className="h-16 w-28" src='/Logo.svg' alt='/Logo.svg'/>
      <div
        className="ipod-body w-full max-w-xs md:max-w-sm p-6 md:p-8 md:m-3 flex flex-col items-center gap-3 md:gap-7">
        {/* Screen */}
        <IPodScreen title={getScreenTitle()} showIcons={showScreenIcons}>
          {gameState === 'start' && (
            <StartScreen onStart={handleStart}/>
          )}

          {gameState === 'playing' && currentAlbum && (
            <GameScreen
              album={currentAlbum}
              userRating={userRating}
              currentRound={currentRound}
              totalRounds={TOTAL_ROUNDS}
              showResult={showResult}
              roundScore={currentRoundScore}
            />
          )}

          {gameState === 'finished' && (
            <ResultsScreen
              results={results}
              totalScore={totalScore}
              maxPossibleScore={maxPossibleScore}
              onPlayAgain={handleAgain}
            />
          )}
        </IPodScreen>

        {/* Click Wheel */}
        <ClickWheel
          value={userRating}
          onChange={setUserRating}
          onCenterClick={handleConfirmRating}
          centerLabel={getCenterLabel()}
          gameState={gameState}
          min={0}
          max={10}
          disabled={showResult}
        />
      </div>
    </div>
  );
};

export default PitchforkGame;
