// Playlist. Add a song: drop the mp3 in /public/audio, the art in /public/album,
// then add one entry here. `weight` is the relative chance of being picked
// (default 1); bump it to make a song show up first more often.
export type Song = {
  id: string;
  title: string;
  artist: string;
  src: string;
  art: string;
  weight?: number;
};

export const songs: Song[] = [
  {
    id: 'lillys-theme',
    title: "Lily's Theme",
    artist: 'L0V3M1ST',
    src: '/audio/lillys-theme.mp3',
    art: '/album/lillys-theme.jpg',
  },
  {
    id: 'last-summer',
    title: 'last summer (sped up)',
    artist: 'ooes',
    src: '/audio/last-summer.mp3',
    art: '/album/last-summer.jpg',
    weight: 1.6,
  },
  {
    id: 'poison-tree',
    title: 'Poison Tree',
    artist: 'Grouper',
    src: '/audio/poison-tree.mp3',
    art: '/album/poison-tree.jpg',
    weight: 1.6,
  },
  {
    id: 'change',
    title: 'Change',
    artist: 'BigXthaPlug',
    src: '/audio/change.mp3',
    art: '/album/change.jpg',
  },
  {
    id: 'from-the-d-to-the-a',
    title: 'From the D to the A',
    artist: 'Tee Grizzley ft. Lil Yachty',
    src: '/audio/from-the-d-to-the-a.mp3',
    art: '/album/from-the-d-to-the-a.jpg',
  },
];

// Weighted random pick. `exclude` skips an id (avoid repeating the current song
// when there is more than one to choose from).
export function pickWeighted(list: Song[] = songs, exclude?: string): Song {
  const pool = exclude && list.length > 1 ? list.filter((s) => s.id !== exclude) : list;
  const total = pool.reduce((sum, s) => sum + (s.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const s of pool) {
    r -= s.weight ?? 1;
    if (r < 0) return s;
  }
  return pool[pool.length - 1];
}
