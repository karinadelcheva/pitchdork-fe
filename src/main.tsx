import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {loadAlbums} from "@/data/albums.ts";

// createRoot(document.getElementById("root")!).render(<App />);
loadAlbums().then(albums => {
  createRoot(document.getElementById("root") as HTMLElement).render(
      <App initialAlbums={albums} />
  );
});