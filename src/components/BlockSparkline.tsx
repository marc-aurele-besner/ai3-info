import { HISTORY_LIMIT } from "@/utils/useNetworkData";

const WIDTH = 160;
const HEIGHT = 32;
const PAD = 3;

function height(value: number) {
  return `#${value.toLocaleString("en-US")}`;
}

/** Block height over this visit's readings, drawn as a small inline line. */
export function BlockSparkline({ history }: { history: number[] }) {
  const first = history[0];
  const last = history[history.length - 1];
  const min = Math.min(...history);
  const range = Math.max(...history) - min || 1;
  const step = (WIDTH - PAD * 2) / (history.length - 1);
  const points = history.map((value, index) => [
    PAD + index * step,
    HEIGHT - PAD - ((value - min) / range) * (HEIGHT - PAD * 2),
  ]);
  const delta = last - first;
  const blocks = `${delta >= 0 ? "+" : "−"}${Math.abs(delta).toLocaleString("en-US")} ${
    Math.abs(delta) === 1 ? "block" : "blocks"
  }`;
  // Older readings drop off once the limit is reached, so only claim
  // "since you arrived" while the full visit is still in view.
  const span =
    history.length < HISTORY_LIMIT
      ? "since you arrived"
      : `over the last ${history.length} readings`;
  const [endX, endY] = points[points.length - 1];

  return (
    <span className="block-sparkline">
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Block height ${delta >= 0 ? "rose" : "changed"} from ${height(first)} to ${height(last)} over ${history.length} readings`}
      >
        <polyline
          points={points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={endX} cy={endY} r="2.5" fill="var(--accent)" />
      </svg>
      <span>
        {blocks} {span} · now {height(last)}
      </span>
    </span>
  );
}
