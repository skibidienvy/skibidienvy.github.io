'use client';

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

const stars = Array.from({ length: 72 }, (_, index) => ({
  left: `${(index * 37 + (index % 5) * 11) % 100}%`,
  top: `${4 + ((index * 29 + (index % 7) * 5) % 54)}%`,
  size: 1 + (index % 4 === 0 ? 1 : 0),
  opacity: 0.22 + (index % 6) * 0.09,
  delay: `${-(index % 9) * 0.47}s`,
}));

const meowLoop = 'meow\u00a0'.repeat(128);

type RidgePoint = readonly [x: number, y: number];

const mountainRidges: readonly (readonly RidgePoint[])[] = [
  [
    [0, 71], [7, 62], [12, 66], [19, 43], [24, 55], [29, 48], [35, 68],
    [42, 53], [48, 59], [56, 34], [63, 51], [68, 45], [75, 63],
    [82, 48], [88, 57], [94, 43], [100, 58],
  ],
  [
    [0, 63], [5, 55], [10, 60], [16, 39], [22, 63], [29, 51], [36, 66],
    [43, 41], [50, 58], [57, 47], [63, 68], [70, 54], [77, 31],
    [84, 55], [91, 44], [96, 58], [100, 51],
  ],
  [
    [0, 68], [8, 55], [14, 65], [21, 40], [27, 50], [33, 42], [41, 65],
    [49, 53], [56, 60], [63, 36], [69, 47], [75, 42], [83, 62],
    [90, 48], [96, 59], [100, 54],
  ],
  [
    [0, 64], [6, 53], [13, 61], [19, 45], [26, 67], [34, 50], [41, 59],
    [48, 35], [55, 55], [62, 48], [69, 67], [76, 51], [82, 57],
    [89, 39], [95, 55], [100, 47],
  ],
  [
    [0, 68], [8, 49], [14, 59], [22, 39], [29, 61], [37, 50], [45, 69],
    [53, 45], [61, 58], [68, 52], [76, 68], [84, 43], [91, 57],
    [96, 49], [100, 54],
  ],
  [
    [0, 67], [8, 58], [14, 65], [22, 38], [29, 57], [37, 46], [44, 62],
    [53, 32], [61, 55], [69, 43], [78, 60], [86, 36], [94, 57],
    [100, 49],
  ],
  [
    [0, 72], [11, 52], [18, 63], [29, 35], [38, 59], [47, 41], [56, 64],
    [66, 39], [75, 56], [84, 45], [92, 62], [100, 51],
  ],
];

const mountainClipPaths = mountainRidges.map((ridge) =>
  `polygon(0% 100%, ${ridge.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%)`,
);

const socials = [
  { name: 'discord', username: '@impossiblebydesign', icon: '/icons/discord.png' },
  { name: 'tiktok', username: '@impossiblebydesign', icon: '/icons/tiktok.png' },
  { name: 'steam', username: '@skibidienvious', icon: '/icons/steam.png' },
  { name: 'github', username: '@skibidienvy', icon: '/icons/github.svg' },
] as const;

const likes = [
  { name: 'undertale', icon: '/icons/undertale.svg', iconClass: '' },
  { name: 'portal 2', icon: '/icons/aperture-science.svg', iconClass: '' },
  { name: 'vibecoding', icon: '/icons/chatgpt.svg', iconClass: '' },
] as const;

const projects = [
  {
    name: 'radium client',
    icon: '/icons/radium.png',
    description: 'minecraft hacked utility mod owned by popular dev nnpg',
    href: 'https://radiumclient.com',
  },
  {
    name: 'fern tas',
    icon: '/icons/ferntas.png',
    description: 'most advanced subway surfers tas tool at the time',
    href: null,
  },
  {
    name: 'relgl',
    icon: '/icons/relgl.png',
    description: 'a remaster of the lgl mod menu template; now outdated and deprecated.',
    href: 'https://github.com/skibidienvy/relgl',
  },
  {
    name: 'geode predictor',
    icon: '/icons/amethyst-cluster.png',
    description: 'donut smp bypass that detected broken geodes',
    href: null,
  },
] as const;

let activeWindowZ = 24;

function MountainLayer({
  layer,
  className,
  depth,
}: {
  layer: number;
  className: string;
  depth: number;
}) {
  const clipPath = mountainClipPaths[layer];

  return (
    <div
      className={`mountain-layer ${className}`}
      data-depth={depth}
      style={{ clipPath, WebkitClipPath: clipPath }}
    />
  );
}

function VhsShader() {
  return <div className="vhs-shader" aria-hidden="true" />;
}

function MountainPicture({ glitch = false }: { glitch?: boolean }) {
  return (
    <div
      className={`mountain-picture${glitch ? ' mountain-picture-glitch' : ''}`}
      aria-hidden="true"
    >
      <div className="mountain-sky" />
      <div className="star-field" data-depth="0.045">
        {stars.map((star, index) => (
          <span
            key={index}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div className="moon" data-depth="0.035" />
      <div className="mountain-world">
        <MountainLayer layer={5} className="mountain-layer-back-1" depth={0.075} />
        <MountainLayer layer={6} className="mountain-layer-back-2" depth={0.11} />
        <MountainLayer layer={0} className="mountain-layer-1" depth={0.16} />
        <MountainLayer layer={1} className="mountain-layer-2" depth={0.3} />
        <MountainLayer layer={2} className="mountain-layer-3" depth={0.52} />
        <MountainLayer layer={3} className="mountain-layer-4" depth={0.78} />
        <MountainLayer layer={4} className="mountain-layer-5" depth={1.08} />
      </div>
      <div className="mountain-grain" />
      <div className="mountain-vignette" />
    </div>
  );
}

function DesktopWindow({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: ReactNode;
}) {
  const windowRef = useRef<HTMLElement>(null);
  const drag = useRef({ active: false, x: 0, y: 0, left: 0, top: 0 });

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || window.matchMedia('(max-width: 760px)').matches) return;
    const node = windowRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    drag.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      left: bounds.left,
      top: bounds.top,
    };
    node.style.zIndex = String(++activeWindowZ);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const node = windowRef.current;
    if (!node) return;
    const left = Math.min(
      Math.max(8, drag.current.left + event.clientX - drag.current.x),
      Math.max(8, window.innerWidth - node.offsetWidth - 8),
    );
    const top = Math.min(
      Math.max(8, drag.current.top + event.clientY - drag.current.y),
      Math.max(8, window.innerHeight - node.offsetHeight - 8),
    );
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
    node.style.right = 'auto';
    node.style.bottom = 'auto';
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section ref={windowRef} className={`os-window ${className}`} aria-label={title}>
      <div
        className="window-titlebar"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span>{title}</span>
        <span className="window-title-marks" aria-hidden="true">
          <i />
          <i />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function CurrentlyPlayingWindow() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const [isMuted, setIsMuted] = useState(false);
  const seeking = useRef(false);
  const volumeSeeking = useRef(false);
  const seekPointerId = useRef<number | null>(null);
  const volumePointerId = useRef<number | null>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const lastVolume = useRef(0.35);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startPlayback = () => {
      if (audio.paused) {
        void audio.play().catch(() => undefined);
      }
    };

    const startWhenLoaded = () => {
      if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        startPlayback();
      } else {
        audio.addEventListener('canplay', startPlayback, { once: true });
      }
    };

    if (document.readyState === 'complete') {
      startWhenLoaded();
    } else {
      window.addEventListener('load', startWhenLoaded, { once: true });
    }

    return () => {
      window.removeEventListener('load', startWhenLoaded);
      audio.removeEventListener('canplay', startPlayback);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const seekBy = (amount: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Math.min(
      Math.max(0, audio.currentTime + amount),
      audio.duration || duration || 0,
    );
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const seekToRatio = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const length = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : duration;
    if (!length) return;
    const nextTime = Math.min(Math.max(0, ratio), 1) * length;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const updateSeekFromPointer = (clientX: number, element: HTMLDivElement) => {
    const bounds = element.getBoundingClientRect();
    if (!bounds.width) return;
    seekToRatio((clientX - bounds.left) / bounds.width);
  };

  const beginSeek = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!duration) return;
    seeking.current = true;
    seekPointerId.current = event.pointerId;
    seekBarRef.current = event.currentTarget;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some touch browsers do not support pointer capture; the window listener below still tracks it.
    }
    updateSeekFromPointer(event.clientX, event.currentTarget);
  };

  const endSeek = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (seekPointerId.current === null || event.pointerId === seekPointerId.current) {
      seeking.current = false;
      seekPointerId.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      seekBarRef.current = null;
    }
  };

  const handleSeekKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seekBy(-10);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      seekBy(10);
    } else if (event.key === 'Home') {
      event.preventDefault();
      restart();
    } else if (event.key === 'End') {
      event.preventDefault();
      seekToRatio(1);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted || isMuted) {
      const restoredVolume = volume || lastVolume.current;
      audio.volume = restoredVolume;
      audio.muted = false;
      setVolume(restoredVolume);
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const setVolumeValue = (value: number) => {
    const nextVolume = Math.min(Math.max(0, value), 1);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = nextVolume;
      audio.muted = false;
    }
    if (nextVolume > 0) lastVolume.current = nextVolume;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const updateVolumeFromPointer = (clientX: number, element: HTMLDivElement) => {
    const bounds = element.getBoundingClientRect();
    if (!bounds.width) return;
    setVolumeValue((clientX - bounds.left) / bounds.width);
  };

  const beginVolumeSeek = (event: ReactPointerEvent<HTMLDivElement>) => {
    volumeSeeking.current = true;
    volumePointerId.current = event.pointerId;
    volumeBarRef.current = event.currentTarget;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some touch browsers do not support pointer capture; the window listener below still tracks it.
    }
    updateVolumeFromPointer(event.clientX, event.currentTarget);
  };

  const endVolumeSeek = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (volumePointerId.current === null || event.pointerId === volumePointerId.current) {
      volumeSeeking.current = false;
      volumePointerId.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      volumeBarRef.current = null;
    }
  };

  const handleVolumeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      setVolumeValue(volume - 0.05);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      setVolumeValue(volume + 0.05);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setVolumeValue(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setVolumeValue(1);
    }
  };

  useEffect(() => {
    const moveActivePointer = (event: PointerEvent) => {
      if (seeking.current && seekBarRef.current && seekPointerId.current === event.pointerId) {
        updateSeekFromPointer(event.clientX, seekBarRef.current);
      }
      if (volumeSeeking.current && volumeBarRef.current && volumePointerId.current === event.pointerId) {
        updateVolumeFromPointer(event.clientX, volumeBarRef.current);
      }
    };

    const releaseActivePointer = (event: PointerEvent) => {
      if (seeking.current && seekPointerId.current === event.pointerId) {
        seeking.current = false;
        seekPointerId.current = null;
        seekBarRef.current = null;
      }
      if (volumeSeeking.current && volumePointerId.current === event.pointerId) {
        volumeSeeking.current = false;
        volumePointerId.current = null;
        volumeBarRef.current = null;
      }
    };

    window.addEventListener('pointermove', moveActivePointer, { passive: true });
    window.addEventListener('pointerup', releaseActivePointer);
    window.addEventListener('pointercancel', releaseActivePointer);
    return () => {
      window.removeEventListener('pointermove', moveActivePointer);
      window.removeEventListener('pointerup', releaseActivePointer);
      window.removeEventListener('pointercancel', releaseActivePointer);
    };
  }, [duration]);

  return (
    <DesktopWindow title="currently playing..." className="music-window">
      <div className="music-player">
        <audio
          ref={audioRef}
          className="music-audio"
          playsInline
          preload="auto"
          src="/audio/transportin-remix.mp3"
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          aria-label="transportin by kodak black"
        />

        <div className="music-track">
          <div className="music-art" aria-hidden="true">♪</div>
          <div className="music-meta">
            <span className="music-kicker">now playing</span>
            <h2>transportin&apos;</h2>
            <p>kodak black</p>
            <span className="music-state">{isPlaying ? 'playing' : 'paused'}</span>
          </div>
        </div>

        <div className="music-progress-row">
          <span>{formatTime(currentTime)}</span>
          <div
            className={`music-progress${duration ? '' : ' is-disabled'}`}
            ref={seekBarRef}
            role="slider"
            tabIndex={duration ? 0 : -1}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-label="song progress"
            aria-disabled={!duration}
            onPointerDown={beginSeek}
            onPointerUp={endSeek}
            onPointerCancel={endSeek}
            onKeyDown={handleSeekKeyDown}
          >
            <span
              className="music-progress-fill"
              style={{ width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }}
            />
            <span
              className="music-progress-thumb"
              style={{ left: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="music-controls" aria-label="playback controls">
          <button type="button" className="music-control" onClick={restart} aria-label="restart song">
            |&lt;
          </button>
          <button type="button" className="music-control" onClick={() => seekBy(-10)} aria-label="skip back ten seconds">
            -10
          </button>
          <button
            type="button"
            className="music-control music-play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'pause song' : 'play song'}
          >
            {isPlaying ? 'pause' : 'play'}
          </button>
          <button type="button" className="music-control" onClick={() => seekBy(10)} aria-label="skip forward ten seconds">
            +10
          </button>
          <button type="button" className="music-control" onClick={restart} aria-label="restart song">
            &gt;|
          </button>
        </div>

        <div className="music-volume-row">
          <button type="button" className="music-volume-button" onClick={toggleMute}>
            {isMuted || volume === 0 ? 'unmute' : 'mute'}
          </button>
          <div
            className="music-volume"
            ref={volumeBarRef}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={volume}
            aria-label="volume"
            onPointerDown={beginVolumeSeek}
            onPointerUp={endVolumeSeek}
            onPointerCancel={endVolumeSeek}
            onKeyDown={handleVolumeKeyDown}
          >
            <span className="music-volume-fill" style={{ width: `${volume * 100}%` }} />
            <span className="music-volume-thumb" style={{ left: `${volume * 100}%` }} />
          </div>
        </div>
      </div>
    </DesktopWindow>
  );
}

function DesktopWindows() {
  const [copied, setCopied] = useState('');
  const [blockedProject, setBlockedProject] = useState<string | null>(null);
  const clearCopiedTimer = useRef<number | undefined>(undefined);
  const clearBlockedTimer = useRef<number | undefined>(undefined);
  const blockedFrame = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(clearCopiedTimer.current);
      window.clearTimeout(clearBlockedTimer.current);
      if (blockedFrame.current !== undefined) {
        window.cancelAnimationFrame(blockedFrame.current);
      }
    },
    [],
  );

  const copyUsername = async (username: string) => {
    try {
      await navigator.clipboard.writeText(username);
    } catch {
      const input = document.createElement('textarea');
      input.value = username;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopied(username);
    window.clearTimeout(clearCopiedTimer.current);
    clearCopiedTimer.current = window.setTimeout(() => setCopied(''), 1600);
  };

  const showBlocked = (projectName: string) => {
    setBlockedProject(null);
    window.clearTimeout(clearBlockedTimer.current);
    if (blockedFrame.current !== undefined) {
      window.cancelAnimationFrame(blockedFrame.current);
    }
    blockedFrame.current = window.requestAnimationFrame(() => {
      setBlockedProject(projectName);
      clearBlockedTimer.current = window.setTimeout(
        () => setBlockedProject(null),
        700,
      );
    });
  };

  return (
    <div className="desktop-ui">
      <DesktopWindow title="hey..." className="intro-window">
        <div className="intro-layout">
          <p className="intro-copy">
            im envy, im 15
            <br />
            and people think
            <br />
            im a catboy or sum
          </p>
          <img className="intro-avatar" src="/icons/intro-avatar.png" alt="envy avatar" />
        </div>
      </DesktopWindow>

      <DesktopWindow title="socials:" className="socials-window">
        <div className="social-grid">
          {socials.map((social) => (
            <button
              key={social.name}
              className="social-button"
              type="button"
              onClick={() => copyUsername(social.username)}
              title={`copy ${social.username}`}
              aria-label={`copy ${social.name} username ${social.username}`}
            >
              <img src={social.icon} alt="" />
              <span>{social.name}</span>
            </button>
          ))}
        </div>
        <p className="copy-status" aria-live="polite">
          {copied ? `copied ${copied}` : 'click an icon to copy'}
        </p>
      </DesktopWindow>

      <DesktopWindow title="i like..." className="likes-window">
        <ul className="likes-grid">
          {likes.map((like) => (
            <li key={like.name} className="like-card">
              <img className={like.iconClass} src={like.icon} alt="" />
              <span>{like.name}</span>
            </li>
          ))}
        </ul>
      </DesktopWindow>

      <CurrentlyPlayingWindow />

      <DesktopWindow title="i worked on..." className="projects-window">
        <div className="project-grid">
          {projects.map((project) => {
            const content = (
              <>
                <img src={project.icon} alt="" />
                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </>
            );

            return project.href ? (
              <a key={project.name} className="project-card" href={project.href}>
                {content}
              </a>
            ) : (
              <button
                key={project.name}
                className={`project-card project-card-blocked${blockedProject === project.name ? ' is-blocked' : ''}`}
                type="button"
                onClick={() => showBlocked(project.name)}
              >
                {content}
                <span className="blocked-label" aria-live="polite">
                  {blockedProject === project.name ? 'blocked' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </DesktopWindow>
    </div>
  );
}

export default function Home() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const layers = Array.from(
      scene.querySelectorAll<HTMLElement>('[data-depth]'),
    );
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const updateTarget = (event: PointerEvent) => {
      target.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      target.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const draw = () => {
      const ease = reducedMotion.matches ? 0.025 : 0.065;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      const motionScale = reducedMotion.matches ? 0.3 : 1;

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        const x = current.x * depth * -22 * motionScale;
        const y = current.y * depth * -10 * motionScale;
        const scale = 1.045 + depth * 0.012;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      });

      frame = window.requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', updateTarget, { passive: true });
    document.documentElement.addEventListener('mouseleave', resetTarget);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updateTarget);
      document.documentElement.removeEventListener('mouseleave', resetTarget);
    };
  }, []);

  return (
    <main ref={sceneRef} className="mountain-scene">
      <MountainPicture />
      <div className="mountain-distortion-window" aria-hidden="true">
        <MountainPicture glitch />
      </div>
      <VhsShader />
      <DesktopWindows />
      <footer className="meow-ticker" aria-label="meow meow meow">
        <div className="meow-ticker-track">
          <span>{meowLoop}</span>
          <span aria-hidden="true">{meowLoop}</span>
        </div>
      </footer>
    </main>
  );
}
