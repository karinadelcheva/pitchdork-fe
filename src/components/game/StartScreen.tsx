import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center slide-up">
      <div className="mb-6">
        {/*<h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">*/}
        {/*  Pitchfork*/}
        {/*</h1>*/}
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/Pitchdork.png" alt="Pitchdork Logo" className="h-16 w-56"/>
        </div>
        <h2 className="text-xl md:text-xl font-semibold text-primary">
          A Rating Game
        </h2>
      </div>
      
      {/*<p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">*/}
      {/*  Guess the Pitchfork rating for 5 albums. Use the click wheel to set your rating.*/}
      {/*</p>*/}

      {/*<div className="mt-8 text-xs text-muted-foreground/70 animate-pulse-glow">*/}
      {/*  Press START to start*/}
      {/*</div>*/}
    </div>
  );
};

export default StartScreen;
