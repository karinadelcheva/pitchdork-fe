import {createClient, SupabaseClient} from '@supabase/supabase-js'
import {SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY} from '.././const.ts'

export interface Album {
  album: string;
  artist: string;
  rating: number;
  year_released: number;
  small_text: string;
  review: string;
  reviewer: string;
  genre: string;
  label: string;
  reviewed: string;
  album_art_url: string;
}

// Initialize supabase client as a singleton for interacting with DB
const supa: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

const AlbumService = supa => {
  return {
    getRandomAlbums: async (count: number = 5): Promise<Album[]> => {
      const { data, status } = await supa
        .from('momchi_random_albums')
        .select('*')
        .limit(count);
      if (status !== 200) {
        throw new Error('GET RANDOM ALBUMS: Failed to fetch')
      }
      return data
    },
    getAlbumsById: async (ids: string[]): Promise<Album[]> => {
      const {data, error} = await supa.from('pitchfork_reviews').select('*').where('id', 'in', ids)
      if (error) {
        throw new Error('GET ALBUMS: Failed to fetch')
      }
      return data
    },
    getAlbumById: async (id: string): Promise<Album> => {
      const {data, error} = await supa.from('pitchfork_reviews').select('*').eq('id', id)
      if (error) {
        throw new Error('GET ALBUM BY ID: Failed to fetch')
      }
      return data[0]
    }
  }
}

export const albumService = AlbumService(supa)