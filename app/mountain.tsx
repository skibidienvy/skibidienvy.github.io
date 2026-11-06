const stars = Array.from({ length: 72 }, (_, index) => ({
  left: `${(index * 37 + (index % 5) * 11) % 100}%`,
  top: `${4 + ((index * 29 + (index % 7) * 5) % 54)}%`,
  size: 1 + (index % 4 === 0 ? 1 : 0),
  opacity: 0.22 + (index % 6) * 0.09,
  delay: `${-(index % 9) * 0.47}s`,
}));

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

export function VhsShader() {
  return <div className="vhs-shader" aria-hidden="true" />;
}

export function MountainPicture({ glitch = false }: { glitch?: boolean }) {
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
