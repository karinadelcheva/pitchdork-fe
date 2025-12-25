import { Helmet } from 'react-helmet-async';
import PitchforkGame from '@/components/game/PitchforkGame';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Pitchdork - Pitchfork Rating Game - Guess the Album Scores</title>
        <meta 
          name="description" 
          content="Test your music critic skills! Guess the Pitchfork rating for famous albums using our retro iPod-inspired interface." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Helmet>
      <PitchforkGame />
    </>
  );
};

export default Index;
