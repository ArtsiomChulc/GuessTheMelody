export type Song = { path: string; title: string; points: number; isPlayed: boolean }

export interface Category {
  id: string
  name: string
  songs: Song[]
}

export interface Team {
  id: string
  name: string
  score: number
}
