interface Props {
  strokeWidth?: number;
  sqSize?: number;
  percentage: number;
}

export default function CircularProgressBar({
  strokeWidth = 16,
  sqSize = 160,
  percentage,
}: Props) {
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100;
  const color =
    percentage < 50
      ? "stroke-red-400"
      : percentage < 75
        ? "stroke-yellow-400"
        : "stroke-green-400";

  return (
    <div className="relative size-full">
      <svg width="100%" height="100%" viewBox={viewBox}>
        <circle
          className="fill-olive-900"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
        />
        <circle
          className="fill-none stroke-olive-700"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className={`fill-none ${color} transition-all delay-200 ease-in`}
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeLinecap="round"
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[10px] sm:text-sm md:text-base font-bold text-primary mt-2/2"
        >
          {percentage}
        </span>
      </div>
    </div>
  );
}
