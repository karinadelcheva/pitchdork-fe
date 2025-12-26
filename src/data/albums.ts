import { Album, albumService } from "@/data/AlbumService.ts";
import { TOTAL_ROUNDS } from "@/const.ts";
import { LOCAL_ALBUMS } from "@/data/local-albums.ts";

let cachedAlbums: Album[] | null = null;

export async function loadAlbums(): Promise<Album[]> {
  if (cachedAlbums) return cachedAlbums;
  try {
    cachedAlbums = await albumService.getRandomAlbums(TOTAL_ROUNDS);
  } catch (e) {
    console.error("Failed to load albums from Supabase, falling back:", e);
    cachedAlbums = LOCAL_ALBUMS;
  }
  return cachedAlbums;
}
