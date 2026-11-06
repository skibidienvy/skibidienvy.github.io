'use client';

import { useEffect, useRef, useState } from 'react';
import { DesktopWindow } from './desktop-window';
import { type Song, songs, pickWeighted } from './songs';

const START_VOLUME = 0.35;

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function CurrentlyPlayingWindow({
  z,
  onFocus,
}: {
  z: number;
  onFocus: (id: string) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(START_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatOne, setRepeatOne] = useState(false);

  // Pick one song per page load, client-only (random in render would mismatch SSR).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only random pick
    setSong(pickWeighted(songs));
  }, []);

  // Load + best-effort autoplay on song change. Browsers block autoplay-with-sound
  // until a gesture, so on rejection we start on the first tap/click/keypress.
  useEffect(() => {
    if (!song) return;
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    audio.load();

    function unlock(event: Event) {
      removeUnlock();
      // If the gesture was the play button, let its own handler run — otherwise
      // we'd start playback here and the click would immediately toggle it back.
      const target = event.target as Element | null;
      if (target?.closest?.('.music-play')) return;
      if (audio!.paused) {
        audio!.play().then(() => setIsPlaying(true)).catch(() => undefined);
      }
    }
    function removeUnlock() {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('touchstart', unlock);
      });

    return removeUnlock;
  }, [song]);

  // Keep the audio element in sync with volume / mute / repeat state.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.loop = repeatOne;
  }, [repeatOne, song]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => undefined);
    } else {
      audio.pause();
    }
  };

  const goNext = () => setSong(pickWeighted(songs, song?.id));

  const seekBy = (amount: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const length = audio.duration || duration || 0;
    const nextTime = Math.min(Math.max(0, audio.currentTime + amount), length);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };

  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <DesktopWindow id="music" title="currently playing..." className="music-window" z={z} onFocus={onFocus}>
      <div className="music-player">
        <audio
          ref={audioRef}
          className="music-audio"
          playsInline
          preload="auto"
          src={song?.src}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={goNext}
          aria-label={song ? `${song.title} by ${song.artist}` : undefined}
        />

        <div className="music-track">
          <div className="music-art" aria-hidden="true">
            {song ? <img src={song.art} alt="" /> : '♪'}
          </div>
          <div className="music-meta">
            <span className="music-kicker">now playing</span>
            <h2>{song?.title ?? '…'}</h2>
            <p>{song?.artist ?? ''}</p>
            <span className="music-state">{isPlaying ? 'playing' : 'paused'}</span>
          </div>
        </div>

        <div className="music-progress-row">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="music-range"
            min={0}
            max={duration || 0}
            step="any"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            disabled={!duration}
            aria-label="seek"
            style={{ '--fill': `${progress}%` } as React.CSSProperties}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="music-controls" aria-label="playback controls">
          <button type="button" className="music-control" onClick={goNext} aria-label="skip song">
            skip
          </button>
          <button type="button" className="music-control" onClick={() => seekBy(-5)} aria-label="rewind 5 seconds">
            <span className="music-icon music-icon-prev" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="music-control music-play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'pause song' : 'play song'}
          >
            {isPlaying ? 'pause' : 'play'}
          </button>
          <button type="button" className="music-control" onClick={() => seekBy(5)} aria-label="forward 5 seconds">
            <span className="music-icon music-icon-next" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`music-control${repeatOne ? ' is-active' : ''}`}
            onClick={() => setRepeatOne((r) => !r)}
            aria-pressed={repeatOne}
            aria-label="repeat current song"
          >
            loop
          </button>
        </div>

        <div className="music-volume-row">
          <button
            type="button"
            className="music-volume-button"
            onClick={() => setIsMuted((m) => !m)}
            aria-pressed={isMuted}
          >
            {isMuted || volume === 0 ? 'unmute' : 'mute'}
          </button>
          <input
            type="range"
            className="music-range"
            min={0}
            max={1}
            step="any"
            value={isMuted ? 0 : volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
            aria-label="volume"
            style={{ '--fill': `${volumePercent}%` } as React.CSSProperties}
          />
        </div>
      </div>
    </DesktopWindow>
  );
}
