import { Helmet } from 'react-helmet-async';
import PitchforkGame from '@/components/game/PitchforkGame';
import {Album} from "@/data/AlbumService.ts";

const Index = (props: { initialAlbums: Album[] }) => {
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
      <PitchforkGame initialAlbums={props.initialAlbums} />
    </>
  );
};

export default Index;
