const COLORS = ["#C97B5B", "#E3B04B", "#F6D5C2", "#7FB69E", "#FFFFFF"];

// Nine flags hanging along a curved string. The string is a smooth curve, and each
// flag sits on it at an even step, so the garland sags in the middle like the real thing.
export default function Bunting() {
  const flags = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 10;
    return { x: 400 * t, y: 8 + 104 * t * (1 - t), color: COLORS[i % COLORS.length] };
  });

  return (
    <svg className="bunting" viewBox="0 0 400 76" aria-hidden="true">
      <path d="M0 8 Q200 60 400 8" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      {flags.map((flag, i) => (
        <polygon
          key={i}
          points={`${flag.x - 15},${flag.y} ${flag.x + 15},${flag.y} ${flag.x},${flag.y + 32}`}
          fill={flag.color}
        />
      ))}
    </svg>
  );
}